"""
Template processor chính xử lý template content
"""

import re
from utils import extract_balanced_parentheses
from conditional_handlers import ConditionalHandlers
from loop_handlers import LoopHandlers
from section_handlers import SectionHandlers
from template_processors import TemplateProcessors
from directive_processors import DirectiveProcessor
from event_directive_processor import EventDirectiveProcessor

class TemplateProcessor:
    def __init__(self, usestate_variables=None):
        self.conditional_handlers = ConditionalHandlers()
        self.loop_handlers = LoopHandlers()
        self.section_handlers = SectionHandlers()
        self.template_processors = TemplateProcessors()
        self.directive_processors = DirectiveProcessor()
        self.event_processor = EventDirectiveProcessor(usestate_variables or set())
    
    def process_template(self, blade_code):
        """Process template content and extract sections"""
        # Process @verbatim...@endverbatim blocks FIRST to protect content from processing
        blade_code = self._process_verbatim_blocks(blade_code)
        
        # Remove page/document directives - these are only for PHP compilation, not JS
        # @pageStart, @pageEnd, @pageOpen, @pageClose, @docStart, @docEnd
        blade_code = self._remove_page_directives(blade_code)
        
        # Remove already processed directives
        blade_code = re.sub(r'@extends\s*\([^)]*\)', '', blade_code, flags=re.DOTALL)
        blade_code = re.sub(r'@vars\s*\([^)]*\)', '', blade_code, flags=re.DOTALL)
        
        # Remove @let directives with balanced parentheses
        let_pattern = r'@let\s*\('
        while re.search(let_pattern, blade_code):
            match = re.search(let_pattern, blade_code)
            if match:
                start_pos = match.end() - 1
                content, end_pos = extract_balanced_parentheses(blade_code, start_pos)
                if content is not None:
                    blade_code = blade_code[:match.start()] + blade_code[start_pos + len(content) + 2:]
                else:
                    break
        
        # Remove @const directives with balanced parentheses
        const_pattern = r'@const\s*\('
        while re.search(const_pattern, blade_code):
            match = re.search(const_pattern, blade_code)
            if match:
                start_pos = match.end() - 1
                content, end_pos = extract_balanced_parentheses(blade_code, start_pos)
                if content is not None:
                    blade_code = blade_code[:match.start()] + blade_code[start_pos + len(content) + 2:]
                else:
                    break
        
        # Remove @useState directives with balanced parentheses
        usestate_pattern = r'@useState\s*\('
        while re.search(usestate_pattern, blade_code):
            match = re.search(usestate_pattern, blade_code)
            if match:
                start_pos = match.end() - 1
                content, end_pos = extract_balanced_parentheses(blade_code, start_pos)
                if content is not None:
                    blade_code = blade_code[:match.start()] + blade_code[start_pos + len(content) + 2:]
                else:
                    break
        # Remove @fetch directive with balanced parentheses
        fetch_pattern = r'@fetch\s*\('
        while re.search(fetch_pattern, blade_code):
            match = re.search(fetch_pattern, blade_code)
            if match:
                start_pos = match.end() - 1
                fetch_content, end_pos = extract_balanced_parentheses(blade_code, start_pos)
                if fetch_content is not None:
                    blade_code = blade_code[:match.start()] + blade_code[start_pos + len(fetch_content) + 2:]
                else:
                    break
        blade_code = re.sub(r'@await\s*\([^)]*\)', '', blade_code, flags=re.DOTALL)

        # Process @include directives (multiline support) BEFORE processing line by line
        blade_code = self._process_multiline_include_directives(blade_code)

        # Remove @subscribe directive with balanced parentheses
        subscribe_pattern = r'@subscribe\s*\('
        while re.search(subscribe_pattern, blade_code, flags=re.IGNORECASE):
            match = re.search(subscribe_pattern, blade_code, flags=re.IGNORECASE)
            if match:
                start_pos = match.end() - 1
                sub_content, end_pos = extract_balanced_parentheses(blade_code, start_pos)
                if sub_content is not None:
                    blade_code = blade_code[:match.start()] + blade_code[start_pos + len(sub_content) + 2:]
                else:
                    break

        # Remove @dontsubscribe (with or without parentheses)
        blade_code = re.sub(r'@dontsubscribe\s*\([^)]*\)', '', blade_code, flags=re.DOTALL | re.IGNORECASE)
        blade_code = re.sub(r'@dontsubscribe\b', '', blade_code, flags=re.IGNORECASE)

        blade_code = re.sub(r'@oninit.*?@endoninit', '', blade_code, flags=re.DOTALL | re.IGNORECASE)
        # Remove @register directive - với hoặc không có parameters
        blade_code = re.sub(r'@register\s*(?:\([^)]*\))?.*?@endregister', '', blade_code, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove @setup directive (alias of @register) - với hoặc không có parameters
        blade_code = re.sub(r'@setup\s*(?:\([^)]*\))?.*?@endsetup', '', blade_code, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove @script directive (xử lý như @register)
        blade_code = re.sub(r'@script\s*(?:\([^)]*\))?.*?@endscript', '', blade_code, flags=re.DOTALL | re.IGNORECASE)
        
        lines = blade_code.splitlines()
        output = []
        sections = []
        stack = []
        skip_until = None
        remove_directive_markers = False
        in_pre_tag = False  # Track if we're inside <pre> tags
        
        i = 0
        while i < len(lines):
            original_line = lines[i]
            
            # Check if we're entering or leaving <pre> tags
            if '<pre>' in original_line or '<pre ' in original_line:
                in_pre_tag = True
            if '</pre>' in original_line:
                in_pre_tag = False
            
            # Preserve whitespace inside <pre> tags
            if in_pre_tag:
                line = original_line.rstrip()  # Only remove trailing whitespace
            else:
                line = original_line.strip()  # Normal processing
            
            if not line:
                # Don't add empty lines in loops
                if not (stack and stack[-1][0] in ['for', 'while']):
                    output.append('')
                i += 1
                continue
            
            # Handle skip modes
            if skip_until:
                if skip_until == '@endserverside':
                    # Check for all endserverside aliases
                    endserverside_aliases = [
                        '@endserverside', '@endServerSide', '@endSSR', '@endSsr', 
                        '@EndSSR', '@EndSsr', '@endssr'
                    ]
                    if any(line.startswith(alias) for alias in endserverside_aliases):
                        skip_until = None
                        remove_directive_markers = False
                        # Skip the end directive line
                        i += 1
                        continue
                elif skip_until == '@endclientside':
                    # Check for all endclientside aliases
                    endclientside_aliases = [
                        '@endclientside', '@endClientSide', '@endcsr', '@endCSR', 
                        '@endCsr', '@endusecsr', '@endUseCSR', '@endUseCsr'
                    ]
                    if any(line.startswith(alias) for alias in endclientside_aliases):
                        skip_until = None
                        remove_directive_markers = False
                        # Skip the end directive line
                        i += 1
                        continue
                    elif remove_directive_markers:
                        # Process line normally but remove directive markers
                        processed_line = self.template_processors.process_template_line(line)
                        output.append(processed_line)
                else:
                    # Original logic for other skip modes
                    if line.startswith(skip_until):
                        skip_until = None
                        remove_directive_markers = False
                        # Skip the end directive line
                        i += 1
                        continue
                i += 1
                continue
            
            # Check for multiline event directives
            if self._is_incomplete_event_directive(line):
                # Join with next lines until complete
                complete_line, lines_joined = self._join_multiline_event_directive(lines, i)
                if complete_line:
                    processed = self._process_line_directives(complete_line, stack, output, sections)
                    if processed:
                        output.append(processed)
                    # Skip the lines that were joined
                    i += lines_joined
                    continue
            
            # Process directives
            processed = self._process_line_directives(line, stack, output, sections)
            if processed:
                if processed == 'skip_until_@endserverside':
                    skip_until = '@endserverside'
                    # Skip the @ssr line itself
                    i += 1
                    continue
                elif processed == 'remove_directive_markers_until_@endclientside':
                    skip_until = '@endclientside'
                    remove_directive_markers = True
                    # Skip the @csr line itself
                    i += 1
                    continue
                else:
                    # Append the processed directive result
                    output.append(processed)
                i += 1
                continue
            
            # Check if we're inside a php block first
            if stack and stack[-1][0] == 'php':
                # Convert PHP to JavaScript
                if line.strip():
                    from php_converter import php_to_js
                    js_code = php_to_js(line)
                    processed_line = f"    {js_code}"
                else:
                    # Skip empty lines in php blocks
                    i += 1
                    continue
            else:
                # Process regular content
                processed_line = self.template_processors.process_template_line(line)
                
                # Check if we're inside a loop that needs output variable
                if stack and stack[-1][0] in ['for', 'while']:
                    # Skip empty lines in loops completely
                    if not processed_line.strip():
                        i += 1
                        continue
                    
                    # Get loop info first
                    loop_type = stack[-1][0]
                    output_var = f"__{loop_type}OutputContent__"
                    
                    # Handle @endwhile/@endfor in loops
                    if line.startswith('@endwhile') or line.startswith('@endfor'):
                        # Process the end directive
                        processed = self._process_line_directives(line, stack, output, sections)
                        if processed:
                            output.append(processed)
                        i += 1
                        continue
                    
                    # Handle @php ... @endphp as a pair directive in loops
                    if line.startswith('@php'):
                        # Find the matching @endphp
                        php_content = []
                        j = i + 1
                        while j < len(lines) and not lines[j].strip().startswith('@endphp'):
                            if lines[j].strip():
                                php_content.append(lines[j].strip())
                            j += 1
                        
                        if j < len(lines) and lines[j].strip().startswith('@endphp'):
                            # Found matching @endphp, process the entire php block
                            if php_content:
                                from php_converter import php_to_js
                                js_code = '\n'.join([php_to_js(php_line) for php_line in php_content])
                                processed_line = f"${{APP.View.execute(() => {{\n    {js_code}\n}})}}"
                            else:
                                processed_line = ""
                            
                            # Skip to after @endphp
                            i = j
                        else:
                            # No matching @endphp found, treat as regular content
                            processed_line = self.template_processors.process_template_line(line)
                    else:
                        # Regular content
                        processed_line = self.template_processors.process_template_line(line)
                    
                    # Now append processed_line to the loop's output variable
                    # Check if the last item in output is an incomplete template string for this loop
                    if output and isinstance(output[-1], str) and output[-1].startswith(output_var) and not output[-1].endswith('`;'):
                        # Append to the existing template string
                        output[-1] = output[-1].rstrip('`') + '\n' + processed_line + '`;'
                    else:
                        # Start a new template string
                        output.append(f"{output_var} += `{processed_line}`;")
                    
                    i += 1
                    continue
            
            output.append(processed_line)
            
            i += 1
        
        # Filter out boolean values and join strings
        template_content = '\n'.join([str(item) for item in output if isinstance(item, str)])
        
        # Restore verbatim blocks after all processing is done
        template_content = self._restore_verbatim_blocks(template_content)
        
        return template_content, sections
    
    def _process_event_directives(self, line):
        """Process event directives (@click, @change, @submit, etc.)"""
        # List of event types to check - comprehensive DOM events
        event_types = [
            # Mouse Events
            'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 
            'mouseenter', 'mouseleave', 'wheel', 'auxclick',
            
            # Keyboard Events
            'keydown', 'keyup', 'keypress',
            
            # Form Events
            'input', 'change', 'submit', 'reset', 'invalid', 'search',
            
            # Focus Events
            'focus', 'blur', 'focusin', 'focusout',
            
            # Selection Events
            'select', 'selectstart', 'selectionchange',
            
            # Touch Events
            'touchstart', 'touchmove', 'touchend', 'touchcancel',
            
            # Drag & Drop Events
            'dragstart', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'drop',
            
            # Media Events
            'play', 'pause', 'ended', 'loadstart', 'loadeddata', 'loadedmetadata', 'canplay',
            'canplaythrough', 'waiting', 'seeking', 'seeked', 'ratechange', 'durationchange',
            'volumechange', 'suspend', 'stalled', 'progress', 'emptied', 'encrypted', 'wakeup',
            
            # Window Events
            'load', 'unload', 'beforeunload', 'resize', 'scroll', 'orientationchange',
            'visibilitychange', 'pagehide', 'pageshow', 'popstate', 'hashchange', 'online', 'offline',
            
            # Document Events
            'DOMContentLoaded', 'readystatechange',
            
            # Error Events
            'error', 'abort',
            
            # Context Menu
            'contextmenu',
            
            # Animation Events
            'animationstart', 'animationend', 'animationiteration',
            
            # Transition Events
            'transitionstart', 'transitionend', 'transitionrun', 'transitioncancel',
            
            # Pointer Events (Modern browsers)
            'pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout',
            'pointerenter', 'pointerleave', 'pointercancel', 'gotpointercapture', 'lostpointercapture',
            
            # Fullscreen Events
            'fullscreenchange', 'fullscreenerror',
            
            # Clipboard Events
            'copy', 'cut', 'paste',
            
            # Gamepad Events
            'gamepadconnected', 'gamepaddisconnected',
            
            # Battery Events
            'batterychargingchange', 'batterylevelchange',
            
            # Device Orientation Events
            'deviceorientation', 'devicemotion', 'devicelight', 'deviceproximity',
            
            # WebGL Events
            'webglcontextlost', 'webglcontextrestored'
        ]
        
        result = line
        changed = False
        
        # Process all event directives in the line
        for event_type in event_types:
            # Check for @eventType(...) pattern with balanced parentheses
            pattern = rf'@{event_type}\s*\('
            match = re.search(pattern, result, re.IGNORECASE)
            if match:
                # Extract content within balanced parentheses
                start_pos = match.end() - 1  # Position of opening parenthesis
                content = self._extract_balanced_content(result, start_pos)
                if content is not None:
                    # Replace only the directive part, keep the rest of the HTML
                    event_config = self.event_processor.process_event_directive(event_type, content)
                    # Replace @eventType(...) with event config using balanced parentheses
                    start_pos = match.start()
                    end_pos = start_pos + len(f'@{event_type}(') + len(content) + 1  # +1 for closing )
                    result = result[:start_pos] + event_config + result[end_pos:]
                    changed = True
        
        return result if changed else None
    
    def _is_incomplete_event_directive(self, line):
        """Check if line contains an incomplete event directive"""
        event_types = [
            'click', 'change', 'submit', 'focus', 'blur', 'input', 'keydown', 'keyup', 'keypress',
            'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave',
            'dblclick', 'contextmenu', 'wheel', 'scroll', 'resize', 'load', 'unload', 'beforeunload',
            'error', 'abort', 'select', 'selectstart', 'selectionchange'
        ]
        
        for event_type in event_types:
            pattern = rf'@{event_type}\s*\('
            if re.search(pattern, line, re.IGNORECASE):
                # Check if parentheses are balanced
                paren_count = 0
                in_quotes = False
                quote_char = ''
                
                for char in line:
                    if (char == '"' or char == "'") and not in_quotes:
                        in_quotes = True
                        quote_char = char
                    elif char == quote_char and in_quotes:
                        in_quotes = False
                        quote_char = ''
                    elif not in_quotes:
                        if char == '(':
                            paren_count += 1
                        elif char == ')':
                            paren_count -= 1
                
                # If parentheses are not balanced, it's incomplete
                if paren_count > 0:
                    return True
        
        return False
    
    def _join_multiline_event_directive(self, lines, start_index):
        """Join multiline event directive into a single line"""
        result = lines[start_index].strip()
        lines_joined = 1  # Start with 1 (the first line)
        
        for i in range(start_index + 1, len(lines)):
            line = lines[i].strip()
            result += ' ' + line
            lines_joined += 1
            
            # Check if directive is now complete
            if self._is_event_directive_complete(result):
                return result, lines_joined
        
        return result, lines_joined
    
    def _is_event_directive_complete(self, line):
        """Check if event directive is complete (balanced parentheses)"""
        paren_count = 0
        in_quotes = False
        quote_char = ''
        
        for char in line:
            if (char == '"' or char == "'") and not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char and in_quotes:
                in_quotes = False
                quote_char = ''
            elif not in_quotes:
                if char == '(':
                    paren_count += 1
                elif char == ')':
                    paren_count -= 1
        
        return paren_count == 0
    
    def _extract_balanced_content(self, line, start_pos):
        """Extract content within balanced parentheses"""
        paren_count = 0
        in_quotes = False
        quote_char = ''
        
        for i in range(start_pos, len(line)):
            char = line[i]
            
            if (char == '"' or char == "'") and not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char and in_quotes:
                # Check if this is an escaped quote
                if i > 0 and line[i - 1] == '\\':
                    continue
                in_quotes = False
                quote_char = ''
            elif not in_quotes:
                if char == '(':
                    paren_count += 1
                elif char == ')':
                    paren_count -= 1
                    if paren_count == 0:
                        # Found matching closing parenthesis
                        return line[start_pos + 1:i]
        
        return None
    
    def _process_line_directives(self, line, stack, output, sections):
        """Process Blade directives in a line"""
        
        # Handle event directives (@click, @change, @submit, etc.)
        result = self._process_event_directives(line)
        if result:
            # Process {{ $var }} after event directives
            result = self.template_processors.process_template_line(result)
            return result
        
        # Handle @serverside/@serverSide
        result = self.template_processors.process_serverside_directive(line)
        if result:
            return result
        
        # Handle @clientside
        result = self.template_processors.process_clientside_directive(line)
        if result:
            return result
        
        # Handle @auth/@guest
        result = self.directive_processors.process_auth_directive(line)
        if result:
            return result
        
        # Handle @endauth/@endguest
        result = self.directive_processors.process_endauth_directive(line)
        if result:
            return result
        
        # Handle @can/@cannot
        result = self.directive_processors.process_can_directive(line)
        if result:
            return result
        
        # Handle @endcan/@endcannot
        result = self.directive_processors.process_endcan_directive(line)
        if result:
            return result
        
        # Handle @csrf
        result = self.directive_processors.process_csrf_directive(line)
        if result:
            return result
        
        # Handle @method
        result = self.directive_processors.process_method_directive(line)
        if result:
            return result
        
        # Handle @error
        result = self.directive_processors.process_error_directive(line)
        if result:
            return result
        
        # Handle @enderror
        result = self.directive_processors.process_enderror_directive(line)
        if result:
            return result
        
        # Handle @hasSection
        result = self.directive_processors.process_hassection_directive(line)
        if result:
            return result
        
        # Handle @endhassection
        result = self.directive_processors.process_endhassection_directive(line)
        if result:
            return result
        
        # Handle @empty
        result = self.directive_processors.process_empty_directive(line, stack, output)
        if result:
            return result
        
        # Handle @isset
        result = self.directive_processors.process_isset_directive(line, stack, output)
        if result:
            return result
        
        # Handle @unless
        result = self.directive_processors.process_unless_directive(line)
        if result:
            return result
        
        # Handle @endunless
        result = self.directive_processors.process_endunless_directive(line)
        if result:
            return result
        
        # Handle @endempty
        if line.startswith('@endempty'):
            result = self.directive_processors.process_endempty_directive(stack, output)
            if result:
                return result
        
        # Handle @endisset
        if line.startswith('@endisset'):
            result = self.directive_processors.process_endisset_directive(stack, output)
            if result:
                return result
        
        # Handle @php
        if line.startswith('@php'):
            # Check if we're inside a loop
            if stack and stack[-1][0] in ['for', 'while']:
                # For @php inside loops, don't process as directive, let it be handled as content
                pass
            else:
                result = self.directive_processors.process_php_directive(line, stack, output)
                if result:
                    return result
        
        # Handle @endphp
        if line.startswith('@endphp'):
            # Check if we're inside a loop
            if stack and stack[-1][0] in ['for', 'while']:
                # For @endphp inside loops, don't process as directive, let it be handled as content
                pass
            else:
                result = self.directive_processors.process_endphp_directive(stack, output)
                if result:
                    return result
        
        # Handle @json
        result = self.directive_processors.process_json_directive(line)
        if result:
            return result
        
        # Handle @lang
        result = self.directive_processors.process_lang_directive(line)
        if result:
            return result
        
        # Handle @choice
        result = self.directive_processors.process_choice_directive(line)
        if result:
            return result
        
        # Handle @section
        if line.startswith('@section'):
            return self.section_handlers.process_section_directive(line, stack, output, sections)
        
        if line.startswith('@endsection'):
            return self.section_handlers.process_endsection_directive(stack, output, sections)
        
        # Handle @block
        if line.startswith('@block'):
            return self.section_handlers.process_block_directive(line, stack, output, sections)
        
        if line.startswith('@endblock') or line.startswith('@endBlock'):
            return self.section_handlers.process_endblock_directive(stack, output, sections)
        
        # Handle @if/@endif
        if line.startswith('@if'):
            return self.conditional_handlers.process_if_directive(line, stack, output)
        
        if line.startswith('@elseif'):
            return self.conditional_handlers.process_elseif_directive(line, stack, output)
        
        if line.startswith('@else'):
            return self.conditional_handlers.process_else_directive(line, stack, output)
        
        if line.startswith('@endif'):
            return self.conditional_handlers.process_endif_directive(stack, output)
        
        # Handle @foreach
        if line.startswith('@foreach'):
            return self.loop_handlers.process_foreach_directive(line, stack, output)
        
        if line.startswith('@endforeach'):
            return self.loop_handlers.process_endforeach_directive(stack, output)
        
        # Handle @for
        if line.startswith('@for'):
            return self.loop_handlers.process_for_directive(line, stack, output)
        
        if line.startswith('@endfor'):
            return self.loop_handlers.process_endfor_directive(stack, output)
        
        # Handle @while
        if line.startswith('@while'):
            return self.loop_handlers.process_while_directive(line, stack, output)
        
        if line.startswith('@endwhile'):
            return self.loop_handlers.process_endwhile_directive(stack, output)
        
        # Handle @switch
        if line.startswith('@switch'):
            return self.conditional_handlers.process_switch_directive(line, stack, output)
        
        if line.startswith('@case'):
            return self.conditional_handlers.process_case_directive(line, stack, output)
        
        if line.startswith('@default'):
            return self.conditional_handlers.process_default_directive(line, stack, output)
        
        if line.startswith('@break'):
            return self.conditional_handlers.process_break_directive(line, stack, output)
        
        if line.startswith('@endswitch'):
            return self.conditional_handlers.process_endswitch_directive(stack, output)
        
        # Handle @register
        if line.startswith('@register'):
            result = self.directive_processors.process_register_directive(line, stack, output)
            if result:
                return result
        
        # Handle @endregister
        if line.startswith('@endregister'):
            result = self.directive_processors.process_endregister_directive(stack, output)
            if result:
                return result
                
        # Handle @setup (alias của @register)
        if line.startswith('@setup'):
            result = self.directive_processors.process_register_directive(line, stack, output)
            if result:
                return result
        
        # Handle @endsetup (alias của @endregister)
        if line.startswith('@endsetup'):
            result = self.directive_processors.process_endregister_directive(stack, output)
            if result:
                return result
                
        # Handle @script (xử lý như @register)
        if line.startswith('@script'):
            result = self.directive_processors.process_register_directive(line, stack, output)
            if result:
                return result
        
        # Handle @endscript (xử lý như @endregister)  
        if line.startswith('@endscript'):
            result = self.directive_processors.process_endregister_directive(stack, output)
            if result:
                return result
        
        # Handle @wrapper and @wrap
        if line.startswith('@wrapper') or line.startswith('@wrap'):
            result = self.directive_processors.process_wrapper_directive(line, stack, output)
            if result:
                return result
        
        # Handle @endwrapper and @endwrap
        if line.startswith('@endwrapper') or line.startswith('@endwrap'):
            result = self.directive_processors.process_endwrapper_directive(stack, output)
            if result:
                return result
        
        return False
    
    def _process_multiline_include_directives(self, blade_code):
        """Process multiline @include directives before line-by-line processing"""
        from config import APP_VIEW_NAMESPACE
        from php_converter import convert_php_array_to_json
        
        # Handle @include directive with string literals and variables (multiline arrays/objects)
        def replace_include_directive(match):
            view_name = match.group(1).strip()
            variables = match.group(2).strip() if match.group(2) else '{}'
            
            # Extract PHP function calls to preserve them
            php_functions = {}
            func_counter = 0
            
            def preserve_function(match):
                nonlocal func_counter
                placeholder = f"__FUNC_PLACEHOLDER_{func_counter}__"
                # Convert PHP function to JavaScript with proper prefix handling
                func_call = match.group(0)
                from php_js_converter import php_to_js_advanced
                func_call_js = php_to_js_advanced(func_call)  # Use advanced converter with function prefixes
                php_functions[placeholder] = func_call_js
                func_counter += 1
                return f'"{placeholder}"'
            
            # Preprocess: replace PHP functions with placeholders (improved pattern for various args)
            variables_preprocessed = re.sub(r'\b\w+\([^)]*\)', preserve_function, variables)
            
            # Replace remaining PHP variables with quoted versions for PHP execution
            variables_preprocessed = re.sub(r'\$(\w+)', r'"__VAR_\1__"', variables_preprocessed)
            
            variables_js = convert_php_array_to_json(variables_preprocessed)
            
            # Restore functions and variables
            for placeholder, js_func in php_functions.items():
                variables_js = variables_js.replace(f'"{placeholder}"', js_func)
            
            variables_js = re.sub(r'"__VAR_(\w+)__"', r'\1', variables_js)  # Convert "__VAR_items__" back to items
            
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__include('" + view_name + "', " + variables_js + "))}"
        
        # Handle @include directive with PHP expressions and variables (multiline)
        def replace_include_php_directive(match):
            view_expr = match.group(1).strip()
            variables = match.group(2).strip() if match.group(2) else '{}'
            variables_js = convert_php_array_to_json(variables)
            # Remove $ prefix from variables
            variables_js = re.sub(r'\$(\w+)', r'\1', variables_js)
            # Convert PHP expression to JavaScript
            from php_converter import php_to_js
            view_expr_js = php_to_js(view_expr)
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__include(" + view_expr_js + ", " + variables_js + "))}"
        
        # Process multiline @include directives with proper patterns
        # Handle @include with PHP expressions (must be before string literal patterns)
        blade_code = re.sub(r'@include\s*\(\s*([^,\'"][^)]*?)\s*,\s*(\[[^\]]*\]|\{[^\}]*\}|[^)]*)\s*\)', replace_include_php_directive, blade_code, flags=re.MULTILINE | re.DOTALL)
        
        # Handle @include with string literals (multiline arrays/objects)
        blade_code = re.sub(r'@include\s*\(\s*[\'"]([^\'"]*)[\'"]\s*,\s*(\[[^\]]*\]|\{[^\}]*\}|[^)]*)\s*\)', replace_include_directive, blade_code, flags=re.MULTILINE | re.DOTALL)
        
        # Handle @include without variables
        def replace_include_no_vars_directive(match):
            view_expr = match.group(1).strip()
            from php_converter import php_to_js
            view_expr_js = php_to_js(view_expr)
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__include(" + view_expr_js + "))}"
        
        blade_code = re.sub(r'@include\s*\(\s*([^,\'"][^)]*?)\s*\)', replace_include_no_vars_directive, blade_code)
        blade_code = re.sub(r'@include\s*\(\s*[\'"]([^\'"]*)[\'"]\s*\)', r'${' + APP_VIEW_NAMESPACE + r'.renderView(this.__include("\1", {}))}', blade_code)
        
        return blade_code
    
    def _process_verbatim_blocks(self, blade_code):
        """Process @verbatim...@endverbatim blocks to preserve their content"""
        # Store verbatim blocks and replace them with placeholders
        self.verbatim_blocks = {}
        verbatim_counter = 0
        
        # Find all @verbatim...@endverbatim blocks
        verbatim_pattern = r'@verbatim\s*(.*?)\s*@endverbatim'
        
        def replace_verbatim_block(match):
            nonlocal verbatim_counter
            # Extract the content between @verbatim and @endverbatim
            content = match.group(1)
            # Store content with a unique placeholder
            placeholder = f"__VERBATIM_BLOCK_{verbatim_counter}__"
            self.verbatim_blocks[placeholder] = content
            verbatim_counter += 1
            return placeholder
        
        # Replace all @verbatim blocks with placeholders
        blade_code = re.sub(verbatim_pattern, replace_verbatim_block, blade_code, flags=re.DOTALL)
        
        return blade_code
    
    def _restore_verbatim_blocks(self, processed_content):
        """Restore verbatim blocks from placeholders"""
        if hasattr(self, 'verbatim_blocks'):
            for placeholder, content in self.verbatim_blocks.items():
                processed_content = processed_content.replace(placeholder, content)
        return processed_content
    
    def _remove_page_directives(self, blade_code):
        """
        Remove page/document directives from Blade code.
        These directives are only for PHP compilation (server-side),
        and should be completely removed when compiling to JavaScript (client-side).
        
        Directives to remove:
        - @pageStart, @pageOpen, @docStart
        - @pageEnd, @pageClose, @docEnd
        """
        # Remove all page/document directives (case-insensitive)
        # These directives don't take parameters, so we just match the directive name
        # Pattern matches: @directiveName followed by word boundary, optional whitespace, and optional newline
        directive_patterns = [
            r'@pageStart\b',
            r'@pageOpen\b',
            r'@pageEnd\b',
            r'@pageClose\b',
            r'@docStart\b',
            r'@docEnd\b',
        ]
        
        for pattern in directive_patterns:
            # Remove directive with optional whitespace and newline after it
            # This handles cases like:
            # @pageStart
            # @pageStart\n
            # @pageStart   \n
            blade_code = re.sub(pattern + r'\s*\n?', '', blade_code, flags=re.IGNORECASE | re.MULTILINE)
            # Also handle directive at end of line (standalone on a line)
            blade_code = re.sub(r'^\s*' + pattern + r'\s*$', '', blade_code, flags=re.IGNORECASE | re.MULTILINE)
        
        return blade_code
    
    
