"""
Generators cho các functions (render, prerender, init, etc.)
"""

from config import JS_FUNCTION_PREFIX, HTML_ATTR_PREFIX
import re

class FunctionGenerators:
    def __init__(self):
        pass
    
    def generate_render_function(self, template_content, vars_declaration, extended_view, extends_expression, extends_data, sections_info=None, has_prerender=False, setup_script="", directives_line="", outer_before="", outer_after=""):
        """Generate render function with support for outer content (junk content)"""
        # NOTE: vars_line and directives_line are now handled in wrapper scope
        # No need to call updateVariableData here
        vars_line = ""  # Don't generate vars line anymore
        update_call_line = ""  # Don't call updateVariableData
        view_id_line = "    \n"
        
        # Generate junk content blocks with try-catch for before and after separately
        junk_content_before = ""
        junk_content_after = ""
        junk_var_line = ""
        
        if outer_before and outer_before.strip():
            junk_var_line = "    let __junkContent__ = '';\n"
            junk_content_before = f"""    try {{
        __junkContent__ = `{outer_before}`;
    }} catch(e) {{
        // Ignore junk content errors
    }}
"""
        
        if outer_after and outer_after.strip():
            if not junk_var_line:
                junk_var_line = "    let __junkContent__ = '';\n"
            junk_content_after = f"""    try {{
        __junkContent__ = `{outer_after}`;
    }} catch(e) {{
        // Ignore junk content errors
    }}
"""
        
        # Filter out sections that are already in prerender
        # Only filter if hasPrerender is True (meaning some sections are in prerender)
        filtered_template = template_content
        if sections_info and has_prerender:
            for section in sections_info:
                section_name = section['name']
                use_vars = section.get('useVars', False)
                preloader = section.get('preloader', False)
                section_type = section.get('type', 'long')
                
                # Remove sections that are already in prerender
                # Only remove static sections (not using vars) that are in prerender
                if not use_vars:
                    if section_type == 'short':
                        pattern = fr'\$\{{{JS_FUNCTION_PREFIX}\.section\([\'"]{re.escape(section_name)}[\'"],\s*[^)]+\)\}}'
                        filtered_template = re.sub(pattern, '', filtered_template)
                    else:  # long section
                        pattern = fr'\$\{{{JS_FUNCTION_PREFIX}\.section\([\'"]{re.escape(section_name)}[\'"],\s*\`[^\`]*\`,\s*[\'"]html[\'"]\)\}}'
                        filtered_template = re.sub(pattern, '', filtered_template, flags=re.DOTALL)
                # If section uses vars, keep it in render (dynamic sections)
        
        # Không cần escape template content vì đã được xử lý đúng cách
        filtered_template_escaped = filtered_template
        
        # Replace updateStateByKey('stateKey', value) with update$stateKey(value)
        if directives_line and 'updateStateByKey' in directives_line:
            # Extract all state keys from directives_line
            state_key_matches = re.findall(r"updateStateByKey\('([^']+)'", directives_line)
            for state_key in state_key_matches:
                # Replace updateStateByKey('stateKey', value) with update$stateKey(value)
                pattern = rf"updateStateByKey\('{re.escape(state_key)}',\s*([^)]+)\)"
                replacement = rf"update${state_key}(\1)"
                filtered_template_escaped = re.sub(pattern, replacement, filtered_template_escaped)
        
        # Thêm setup script nhưng loại bỏ useState declarations nếu đã có cơ chế register & update
        setup_line = ""
        if setup_script:
            # Kiểm tra xem có cơ chế register & update không (có updateStateByKey)
            has_register_update = directives_line and 'updateStateByKey' in directives_line
            
            if has_register_update:
                # Nếu có cơ chế register & update, loại bỏ useState declarations từ setup script
                # Chỉ loại bỏ những useState declarations có state key đã được register
                filtered_setup = setup_script
                
                # Tìm tất cả state keys đã được register
                state_keys = []
                if directives_line:
                    # Tìm tất cả updateStateByKey('stateKey', value) trong directives_line
                    matches = re.findall(r"updateStateByKey\('([^']+)'", directives_line)
                    state_keys = matches
                
                # Loại bỏ useState declarations có state key đã được register
                for state_key in state_keys:
                    # Tìm và loại bỏ const [stateKey, setStateKey] = useState(...);
                    pattern = rf'const\s+\[{re.escape(state_key)},\s*[^]]+\]\s*=\s*useState\([^)]+\);'
                    filtered_setup = re.sub(pattern, '', filtered_setup)
                
                # Loại bỏ dòng trống nếu có
                filtered_setup = re.sub(r'^\s*\n', '', filtered_setup)
                
                setup_line = "    " + filtered_setup + "\n" if filtered_setup.strip() else ""
            else:
                # Nếu không có cơ chế register & update, giữ nguyên setup script
                setup_line = "    " + setup_script + "\n"
        
        # Replace App.View.section with this.__section in render function (for short sections)
        filtered_template_escaped = re.sub(r'App\.View\.section\(', 'this.__section(', filtered_template_escaped)
        # Replace App.View.text with this.__text in render function
        filtered_template_escaped = re.sub(r'App\.View\.text\(', 'this.__text(', filtered_template_escaped)
        # Add __ prefix to methods that don't have it yet
        filtered_template_escaped = re.sub(r'this\.subscribeBlock\(', 'this.__subscribeBlock(', filtered_template_escaped)
        filtered_template_escaped = re.sub(r'this\.useBlock\(', 'this.__useBlock(', filtered_template_escaped)
        filtered_template_escaped = re.sub(r'this\.showError\(', 'this.__showError(', filtered_template_escaped)
        
        if extended_view:
            data_param = ", " + extends_data if extends_data else ""
            return f"""function() {{
            {update_call_line}{view_id_line}{setup_line}    let __outputRenderedContent__ = '';
{junk_var_line}{junk_content_before}            try {{
                __outputRenderedContent__ = `{filtered_template_escaped}`;
            }} catch(e) {{
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }}
{junk_content_after}            return this.__extends('{extended_view}'{data_param});
            }}"""
        elif extends_expression:
            data_param = ", " + extends_data if extends_data else ""
            return f"""function() {{
            {update_call_line}{view_id_line}{setup_line}    let __outputRenderedContent__ = '';
{junk_var_line}{junk_content_before}            try {{
                __outputRenderedContent__ = `{filtered_template_escaped}`;
            }} catch(e) {{
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }}
{junk_content_after}            this.superViewPath = {extends_expression};
            return this.__extends(this.superViewPath{data_param});
            }}"""
        else:
            return f"""function() {{
            {update_call_line}{view_id_line}{setup_line}    let __outputRenderedContent__ = '';
{junk_var_line}{junk_content_before}            try {{
                __outputRenderedContent__ = `{filtered_template_escaped}`;
            }} catch(e) {{
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }}
{junk_content_after}            return __outputRenderedContent__;
            }}"""
    
    def generate_prerender_function(self, has_await, has_fetch, vars_line, view_id_line, template_content, extended_view=None, extends_expression=None, extends_data=None, sections_info=None, conditional_content=None, has_prerender=True):
        """Generate prerender function"""
        # If has_prerender is False, always return null
        if not has_prerender:
            return "function() {\n    return null;\n}"
        
        if not has_await and not has_fetch:
            return "function() {\n    return null;\n}"
        
        # Check if any section uses variables from @vars
        has_sections_with_vars = any(section.get('useVars', False) for section in (sections_info or []))
        
        # Check if there are conditional structures with vars
        has_conditional_with_vars = conditional_content and conditional_content.get('has_conditional_with_vars', False)
        
        # Check if we need preloader
        needs_preloader = (has_sections_with_vars or has_conditional_with_vars) and (has_await or has_fetch)
        
        # Generate prerender content based on sections
        prerender_sections = []
        
        for section in (sections_info or []):
            section_name = section['name']
            use_vars = section.get('useVars', False)
            preloader = section.get('preloader', False)
            section_type = section.get('type', 'long')
            
            if not use_vars:
                # Static sections (không dùng biến) - render trực tiếp trong prerender
                # Không cần đợi fetch/await vì không dùng dynamic data
                if section_type == 'short':
                    section_match = re.search(fr'{JS_FUNCTION_PREFIX}\.section\([\'"]{re.escape(section_name)}[\'"],\s*([^)]+),\s*[\'"]string[\'"]\)', template_content)
                    if section_match:
                        section_content = section_match.group(1)
                        prerender_sections.append(f"${{{JS_FUNCTION_PREFIX}.section('{section_name}', {section_content}, 'string')}}")
                else:  # long section
                    section_match = re.search(fr'{JS_FUNCTION_PREFIX}\.section\([\'"]{re.escape(section_name)}[\'"],\s*`([^`]+)`,\s*[\'"]html[\'"]\)', template_content, re.DOTALL)
                    if section_match:
                        section_content = section_match.group(1)
                        prerender_sections.append(f"${{{JS_FUNCTION_PREFIX}.section('{section_name}', `{section_content}`, 'html')}}")
            elif preloader:
                # Dynamic sections (dùng biến + có fetch/await) - render preloader version
                prerender_sections.append(f"${{{JS_FUNCTION_PREFIX}.section('{section_name}', `<div class=\"{HTML_ATTR_PREFIX}preloader\" ref=\"${{__VIEW_ID__}}\" data-view-name=\"${{__VIEW_PATH__}}\">${{{JS_FUNCTION_PREFIX}.text('loading')}}</div>`, 'html')}}")
        
        if prerender_sections:
            prerender_content = f"`\n" + '\n'.join(prerender_sections) + "\n`"
        elif has_conditional_with_vars:
            # Has conditional structures with vars but no sections to prerender
            # Just show general preloader
            prerender_content = f"`<div class=\"{HTML_ATTR_PREFIX}preloader\" ref=\"${{__VIEW_ID__}}\" data-view-name=\"${{__VIEW_PATH__}}\">${{{JS_FUNCTION_PREFIX}.text('loading')}}</div>`"
        else:
            # No sections to prerender, use general preloader
            prerender_content = f"`<div class=\"{HTML_ATTR_PREFIX}preloader\" ref=\"${{__VIEW_ID__}}\" data-view-name=\"${{__VIEW_PATH__}}\">${{{JS_FUNCTION_PREFIX}.text('loading')}}</div>`"
        
        if extended_view:
            data_param = ", " + extends_data if extends_data else ""
            return """function() {
""" + vars_line + view_id_line + """    let __outputRenderedContent__ = '';
            try {
                __outputRenderedContent__ = """ + prerender_content + """;
            } catch(e) {
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }
            return this.__extends('""" + extended_view + """'""" + data_param + """);
            }"""
        elif extends_expression:
            data_param = ", " + extends_data if extends_data else ""
            return """function() {
""" + vars_line + view_id_line + """    let __outputRenderedContent__ = '';
            try {
                __outputRenderedContent__ = """ + prerender_content + """;
            } catch(e) {
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }
            this.superViewPath = """ + extends_expression + """;
            return this.__extends(this.superViewPath""" + data_param + """);
            }"""
        else:
            return """function() {
""" + vars_line + view_id_line + """    let __outputRenderedContent__ = '';
            try {
                __outputRenderedContent__ = """ + prerender_content + """;
            } catch(e) {
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }
            return __outputRenderedContent__;
            }"""
    
    def _convert_all_to_scan(self, template_content):
        """Convert all methods to Scan versions"""
        processed_template = template_content
        
        # Replace all methods with Scan versions
        processed_template = re.sub(r'this\.addBlock\(', 'this.__blockScan(', processed_template)
        processed_template = re.sub(r'this\.renderFollowingBlock\(', 'this.__followScan(', processed_template)
        processed_template = re.sub(r'this\.__include\(', 'this.__includeScan(', processed_template)
        processed_template = re.sub(r'this\.__includeif\(', 'this.__includeifScan(', processed_template)
        processed_template = re.sub(r'this\.__includewhen\(', 'this.__includewhenScan(', processed_template)
        processed_template = re.sub(r'this\.__extends\(', 'this.__extendsScan(', processed_template)
        processed_template = re.sub(r'this\.__showError\(', 'this.__showErrorScan(', processed_template)
        # Replace App.View.section with this.__sectionScan (for short sections)
        processed_template = re.sub(r'App\.View\.section\(', 'this.__sectionScan(', processed_template)
        # Replace this.__section with this.__sectionScan (for long sections)
        processed_template = re.sub(r'this\.__section\(', 'this.__sectionScan(', processed_template)
        # Replace App.View.text with this.__textScan
        processed_template = re.sub(r'App\.View\.text\(', 'this.__textScan(', processed_template)
        # Replace this.__text with this.__textScan
        processed_template = re.sub(r'this\.__text\(', 'this.__textScan(', processed_template)
        processed_template = re.sub(r'this\.subscribe\(', 'this.__subscribeScan(', processed_template)
        processed_template = re.sub(r'this\.__subscribe\(', 'this.__subscribeScan(', processed_template)
        processed_template = re.sub(r'this\.__follow\(', 'this.__followScan(', processed_template)
        processed_template = re.sub(r'this\.__block\(', 'this.__blockScan(', processed_template)
        # Replace block-related methods (both with and without __ prefix)
        processed_template = re.sub(r'this\.subscribeBlock\(', 'this.__subscribeBlockScan(', processed_template)
        processed_template = re.sub(r'this\.__subscribeBlock\(', 'this.__subscribeBlockScan(', processed_template)
        processed_template = re.sub(r'this\.useBlock\(', 'this.__useBlockScan(', processed_template)
        processed_template = re.sub(r'this\.__useBlock\(', 'this.__useBlockScan(', processed_template)
        # Replace event-related methods
        processed_template = re.sub(r'this\.__addEventConfig\(', 'this.__addEventConfigScan(', processed_template)
        processed_template = re.sub(r'this\.__addEventQuickHandle\(', 'this.__addEventQuickHandleScan(', processed_template)
        # Replace App.View.renderView with App.View.scanRenderedView
        processed_template = re.sub(r'App\.View\.renderView\(', 'App.View.scanRenderedView(', processed_template)
        
        return processed_template
    
    def _revert_follow_scan_content(self, template_content):
        """Revert content inside __followScan blocks back to non-Scan versions"""
        def revert_follow_content(match):
            params = match.group(1)
            content = match.group(2)
            
            # Revert Scan methods inside the content
            content = re.sub(r'this\.__blockScan\(', 'this.__block(', content)
            content = re.sub(r'this\.__includeScan\(', 'this.__include(', content)
            content = re.sub(r'this\.__includeifScan\(', 'this.__includeif(', content)
            content = re.sub(r'this\.__includewhenScan\(', 'this.__includewhen(', content)
            content = re.sub(r'this\.__extendsScan\(', 'this.__extends(', content)
            content = re.sub(r'this\.showErrorScan\(', 'this.showError(', content)
            content = re.sub(r'this\.__sectionScan\(', 'this.__section(', content)
            content = re.sub(r'this\.__subscribeScan\(', 'this.__subscribe(', content)
            content = re.sub(r'this\.__followScan\(', 'this.__follow(', content)
            content = re.sub(r'this\.__addEventConfigScan\(', 'this.__addEventConfig(', content)
            content = re.sub(r'this\.__addEventQuickHandleScan\(', 'this.__addEventQuickHandle(', content)
            content = re.sub(r'App\.View\.scanRenderedView\(', 'App.View.renderView(', content)
            
            # Keep the outer __followScan but revert inner content
            return f"${{this.__followScan({params}, () => `{content}`)}}"
        
        # Pattern to match ${this.__followScan([...], () => `CONTENT`)}
        pattern = r'\$\{this\.__followScan\((\[[^\]]+\])\s*,\s*\(\)\s*=>\s*`(.*?)`\s*\)\}'
        
        # Process all matches
        processed_template = re.sub(pattern, revert_follow_content, template_content, flags=re.DOTALL)
        
        return processed_template
    
    def _extract_and_process_follow_blocks(self, template_content):
        """Extract @follow blocks and process them separately using regex"""
        # Use regex to find and replace ${this.__follow([...], () => `CONTENT`)} blocks
        # Convert them to ${this.__followScan([...], () => `CONTENT`)} 
        # but keep the inner content as non-Scan versions
        
        def process_follow_match(match):
            full_match = match.group(0)
            params = match.group(1)
            content = match.group(2)
            
            # Revert Scan methods inside the content
            content = re.sub(r'this\.__blockScan\(', 'this.__block(', content)
            content = re.sub(r'this\.__includeScan\(', 'this.__include(', content)
            content = re.sub(r'this\.__includeifScan\(', 'this.__includeif(', content)
            content = re.sub(r'this\.__includewhenScan\(', 'this.__includewhen(', content)
            content = re.sub(r'this\.__extendsScan\(', 'this.__extends(', content)
            content = re.sub(r'this\.showErrorScan\(', 'this.showError(', content)
            content = re.sub(r'this\.__sectionScan\(', 'this.__section(', content)
            content = re.sub(r'this\.__subscribeScan\(', 'this.__subscribe(', content)
            content = re.sub(r'this\.__followScan\(', 'this.__follow(', content)
            content = re.sub(r'this\.__addEventConfigScan\(', 'this.__addEventConfig(', content)
            content = re.sub(r'App\.View\.scanRenderedView\(', 'App.View.renderView(', content)
            
            # Convert to __followScan format
            return f"${{this.__followScan({params}, () => `{content}`)}}"
        
        # Pattern to match ${this.__follow([...], () => `CONTENT`)}
        pattern = r'\$\{this\.__follow\((\[[^\]]+\])\s*,\s*\(\)\s*=>\s*`(.*?)`\s*\)\}'
        
        
        # Process all matches
        processed_template = re.sub(pattern, process_follow_match, template_content, flags=re.DOTALL)
        
        return processed_template
    
    def _process_single_follow_block(self, follow_block):
        """Process a single @follow block - convert to __followScan but keep inner content as non-Scan"""
        # Extract the parameters and content from @follow ... @endfollow
        # Pattern: @follow([...]) => CONTENT @endfollow
        
        # Find the parameters
        paren_start = follow_block.find('(')
        paren_end = follow_block.find(')')
        if paren_start == -1 or paren_end == -1:
            return follow_block
        
        params = follow_block[paren_start+1:paren_end]
        
        # Find the content after =>
        arrow_pos = follow_block.find('=>')
        if arrow_pos == -1:
            return follow_block
        
        content_start = arrow_pos + 2
        content_end = follow_block.rfind('@endfollow')
        if content_end == -1:
            return follow_block
        
        content = follow_block[content_start:content_end].strip()
        
        # Convert to __followScan format
        result = f"${{this.__followScan([{params}], () => `{content}`)}}"
        return result
    
    def _process_single_follow_block_js(self, follow_block):
        """Process a single ${this.__follow([...], () => `CONTENT`)} block"""
        # Extract the parameters and content from the JavaScript format
        # Pattern: ${this.__follow([...], () => `CONTENT`)}
        
        # Find the parameters
        bracket_start = follow_block.find('[')
        bracket_end = follow_block.find(']')
        if bracket_start == -1 or bracket_end == -1:
            return follow_block
        
        params = follow_block[bracket_start:bracket_end+1]
        
        # Find the content inside backticks
        backtick_start = follow_block.find('`')
        if backtick_start == -1:
            return follow_block
        
        backtick_end = follow_block.rfind('`')
        if backtick_end == -1 or backtick_end <= backtick_start:
            return follow_block
        
        content = follow_block[backtick_start+1:backtick_end]
        
        # Revert Scan methods inside the content
        content = re.sub(r'this\.__blockScan\(', 'this.__block(', content)
        content = re.sub(r'this\.__includeScan\(', 'this.__include(', content)
        content = re.sub(r'this\.__includeifScan\(', 'this.__includeif(', content)
        content = re.sub(r'this\.__includewhenScan\(', 'this.__includewhen(', content)
        content = re.sub(r'this\.__extendsScan\(', 'this.__extends(', content)
        content = re.sub(r'this\.showErrorScan\(', 'this.showError(', content)
        content = re.sub(r'this\.__sectionScan\(', 'this.__section(', content)
        content = re.sub(r'this\.__subscribeScan\(', 'this.__subscribe(', content)
        content = re.sub(r'this\.__followScan\(', 'this.__follow(', content)
        
        # Convert to __followScan format
        result = f"${{this.__followScan({params}, () => `{content}`)}}"
        return result
    
    def _convert_remaining_to_scan(self, template_content):
        """Convert remaining content to Scan versions"""
        processed_template = template_content
        
        # Replace addBlock with __blockScan
        processed_template = re.sub(r'this\.addBlock\(', 'this.__blockScan(', processed_template)
        
        # Replace renderFollowingBlock with __followScan
        processed_template = re.sub(r'this\.renderFollowingBlock\(', 'this.__followScan(', processed_template)
        
        # Replace __include with __includeScan
        processed_template = re.sub(r'this\.__include\(', 'this.__includeScan(', processed_template)
        
        # Replace __includeif with __includeifScan
        processed_template = re.sub(r'this\.__includeif\(', 'this.__includeifScan(', processed_template)
        
        # Replace __includewhen with __includewhenScan
        processed_template = re.sub(r'this\.__includewhen\(', 'this.__includewhenScan(', processed_template)
        
        # Replace __extends with __extendsScan
        processed_template = re.sub(r'this\.__extends\(', 'this.__extendsScan(', processed_template)
        
        # Replace showError with showErrorScan
        processed_template = re.sub(r'this\.__showError\(', 'this.__showErrorScan(', processed_template)
        
        # Replace App.View.section with this.__sectionScan (for short sections)
        processed_template = re.sub(r'App\.View\.section\(', 'this.__sectionScan(', processed_template)
        
        # Replace this.__section with this.__sectionScan (for long sections)
        processed_template = re.sub(r'this\.__section\(', 'this.__sectionScan(', processed_template)
        
        # Replace App.View.text with this.__textScan
        processed_template = re.sub(r'App\.View\.text\(', 'this.__textScan(', processed_template)
        
        # Replace this.__text with this.__textScan
        processed_template = re.sub(r'this\.__text\(', 'this.__textScan(', processed_template)
        
        # Replace this.subscribe with this.__subscribeScan
        processed_template = re.sub(r'this\.subscribe\(', 'this.__subscribeScan(', processed_template)
        
        # Replace this.__subscribe with this.__subscribeScan
        processed_template = re.sub(r'this\.__subscribe\(', 'this.__subscribeScan(', processed_template)
        
        # Replace this.__follow with this.__followScan
        processed_template = re.sub(r'this\.__follow\(', 'this.__followScan(', processed_template)
        
        # Replace this.__block with this.__blockScan
        processed_template = re.sub(r'this\.__block\(', 'this.__blockScan(', processed_template)
        
        # Replace block-related methods (both with and without __ prefix)
        processed_template = re.sub(r'this\.subscribeBlock\(', 'this.__subscribeBlockScan(', processed_template)
        processed_template = re.sub(r'this\.__subscribeBlock\(', 'this.__subscribeBlockScan(', processed_template)
        processed_template = re.sub(r'this\.useBlock\(', 'this.__useBlockScan(', processed_template)
        processed_template = re.sub(r'this\.__useBlock\(', 'this.__useBlockScan(', processed_template)
        # Replace event-related methods
        processed_template = re.sub(r'this\.__addEventConfig\(', 'this.__addEventConfigScan(', processed_template)
        # Replace App.View.renderView with App.View.scanRenderedView
        processed_template = re.sub(r'App\.View\.renderView\(', 'App.View.scanRenderedView(', processed_template)
        
        return processed_template
    
    def _process_follow_blocks_for_virtual_render_simple(self, template_content):
        """Process @follow blocks for virtual render - inside @follow blocks, revert Scan methods back to original"""
        # Find all __followScan calls and their content
        # Inside these blocks, revert Scan methods back to original methods
        
        def process_follow_block(follow_content):
            # Extract the content inside the lambda function
            # Pattern: ${this.__followScan([...], () => `CONTENT`)}
            # We need to keep __followScan but revert content inside
            
            # Find the lambda content
            # Pattern: ${this.__followScan([...], () => `CONTENT`)}
            # Use non-greedy match for the content inside backticks
            lambda_match = re.search(r'\$\{this\.__followScan\((\[[^\]]+\])\s*,\s*\(\)\s*=>\s*`(.*?)`\s*\)\}$', follow_content, re.DOTALL)
            if not lambda_match:
                # Try to understand why it didn't match
                if 'this.__followScan(' in follow_content:
                    print(f"ERROR: __followScan found but regex didn't match!")
                    print(f"Content length: {len(follow_content)}")
                    print(f"Full content:\n{follow_content}")
                    print("\n" + "="*50)
                return follow_content
            
            params = lambda_match.group(1)
            lambda_content = lambda_match.group(2)
            
            # Revert Scan methods inside lambda content
            lambda_content = re.sub(r'this\.__blockScan\(', 'this.__block(', lambda_content)
            lambda_content = re.sub(r'this\.__includeScan\(', 'this.__include(', lambda_content)
            lambda_content = re.sub(r'this\.__includeifScan\(', 'this.__includeif(', lambda_content)
            lambda_content = re.sub(r'this\.__includewhenScan\(', 'this.__includewhen(', lambda_content)
            lambda_content = re.sub(r'this\.__extendsScan\(', 'this.__extends(', lambda_content)
            lambda_content = re.sub(r'this\.showErrorScan\(', 'this.showError(', lambda_content)
            lambda_content = re.sub(r'this\.__sectionScan\(', 'this.__section(', lambda_content)
            lambda_content = re.sub(r'this\.__subscribeScan\(', 'this.__subscribe(', lambda_content)
            lambda_content = re.sub(r'this\.__followScan\(', 'this.__follow(', lambda_content)
            
            # Reconstruct the follow block with reverted lambda content
            result = f"${{this.__followScan({params}, () => `{lambda_content}`)}}"
            return result
        
        # Process all __followScan calls using manual brace counting
        # But only revert the content INSIDE @follow blocks, not the @follow calls themselves
        processed_template = self._process_follow_blocks_manual(template_content, process_follow_block)
        
        return processed_template
    
    def _process_follow_blocks_manual(self, template_content, process_follow_block):
        """Process @follow blocks manually using brace counting"""
        result = []
        i = 0
        while i < len(template_content):
            # Look for __followScan
            if template_content[i:].startswith('${this.__followScan'):
                # Find the matching closing }
                start = i
                brace_depth = 0
                j = i
                in_string = False
                escape_next = False
                
                while j < len(template_content):
                    char = template_content[j]
                    
                    if escape_next:
                        escape_next = False
                        j += 1
                        continue
                    
                    if char == '\\':
                        escape_next = True
                        j += 1
                        continue
                    
                    if char == '`':
                        in_string = not in_string
                    
                    if not in_string:
                        if char == '{' and j > 0 and template_content[j-1] == '$':
                            brace_depth += 1
                        elif char == '}':
                            if brace_depth > 0:
                                brace_depth -= 1
                            if brace_depth == 0 and j + 1 < len(template_content) and template_content[j+1] == ')':
                                # Found the end - this is the closing } followed by )
                                follow_block = template_content[start:j+2]  # Include the closing }
                                # Process the follow block content directly
                                processed_block = process_follow_block(follow_block)
                                result.append(processed_block)
                                i = j + 2
                                break
                    j += 1
            else:
                # Add non-follow content (should already be converted to Scan versions)
                result.append(template_content[i])
                i += 1
        
        return ''.join(result)
    
    def _convert_render_to_virtual_render(self, render_function):
        """Convert render function to virtual render function"""
        # Replace function calls with Scan versions
        virtual_render = render_function
        
        # Replace addBlock with __blockScan
        virtual_render = re.sub(r'this\.addBlock\(', 'this.__blockScan(', virtual_render)
        
        # Replace renderFollowingBlock with __followScan
        virtual_render = re.sub(r'this\.renderFollowingBlock\(', 'this.__followScan(', virtual_render)
        
        # Replace __include with __includeScan
        virtual_render = re.sub(r'this\.__include\(', 'this.__includeScan(', virtual_render)
        
        # Replace __includeif with __includeifScan
        virtual_render = re.sub(r'this\.__includeif\(', 'this.__includeifScan(', virtual_render)
        
        # Replace __includewhen with __includewhenScan
        virtual_render = re.sub(r'this\.__includewhen\(', 'this.__includewhenScan(', virtual_render)
        
        # Replace __extends with __extendsScan
        virtual_render = re.sub(r'this\.__extends\(', 'this.__extendsScan(', virtual_render)
        
        # Replace showError with showErrorScan
        virtual_render = re.sub(r'this\.__showError\(', 'this.__showErrorScan(', virtual_render)
        
        # Replace App.View.section with this.__sectionScan (for short sections)
        virtual_render = re.sub(r'App\.View\.section\(', 'this.__sectionScan(', virtual_render)
        
        # Replace this.__section with this.__sectionScan (for long sections)
        virtual_render = re.sub(r'this\.__section\(', 'this.__sectionScan(', virtual_render)
        
        # Replace App.View.text with this.__textScan
        virtual_render = re.sub(r'App\.View\.text\(', 'this.__textScan(', virtual_render)
        
        # Replace this.__text with this.__textScan
        virtual_render = re.sub(r'this\.__text\(', 'this.__textScan(', virtual_render)
        
        # Replace block-related methods (both with and without __ prefix)
        virtual_render = re.sub(r'this\.subscribeBlock\(', 'this.__subscribeBlockScan(', virtual_render)
        virtual_render = re.sub(r'this\.__subscribeBlock\(', 'this.__subscribeBlockScan(', virtual_render)
        virtual_render = re.sub(r'this\.useBlock\(', 'this.__useBlockScan(', virtual_render)
        virtual_render = re.sub(r'this\.__useBlock\(', 'this.__useBlockScan(', virtual_render)
        # Replace event-related methods
        virtual_render = re.sub(r'this\.__addEventConfig\(', 'this.__addEventConfigScan(', virtual_render)
        # Replace App.View.renderView with App.View.scanRenderedView
        virtual_render = re.sub(r'App\.View\.renderView\(', 'App.View.scanRenderedView(', virtual_render)
        
        # Process @follow blocks: remove HTML/text outside @follow, keep directives
        virtual_render = self._process_follow_blocks_for_virtual_render(virtual_render)
        
        return virtual_render
    
    def _process_follow_blocks_for_virtual_render(self, render_function):
        """Process @follow blocks for virtual render - remove HTML outside @follow blocks"""
        # Find the template content inside the render function
        template_match = re.search(r'__outputRenderedContent__ = `(.*?)`;', render_function, re.DOTALL)
        if not template_match:
            return render_function
        
        template_content = template_match.group(1)
        
        # Process the template content
        processed_template = self._process_template_for_virtual_render(template_content)
        
        # Replace the template content in the render function
        virtual_render = render_function.replace(template_match.group(0), f'__outputRenderedContent__ = `{processed_template}`;')
        
        return virtual_render
    
    def _process_template_for_virtual_render(self, template_content):
        """Process template content for virtual render - remove HTML, keep directives"""
        # For virtual render, we want to:
        # 1. Keep all renderFollowingBlockScan calls and their content
        # 2. Remove HTML content outside @follow blocks
        # 3. Keep only directive calls outside @follow blocks
        
        # Simply extract renderFollowingBlockScan and addBlockScan calls
        # by counting template literal depth
        
        result = []
        i = 0
        while i < len(template_content):
            # Look for renderFollowingBlockScan
            if template_content[i:].startswith('${this.renderFollowingBlockScan'):
                # Find the matching closing }
                start = i
                brace_depth = 0
                j = i
                in_string = False
                escape_next = False
                
                while j < len(template_content):
                    char = template_content[j]
                    
                    if escape_next:
                        escape_next = False
                        j += 1
                        continue
                    
                    if char == '\\':
                        escape_next = True
                        j += 1
                        continue
                    
                    if char == '`':
                        in_string = not in_string
                    
                    if not in_string:
                        if char == '{' and j > 0 and template_content[j-1] == '$':
                            brace_depth += 1
                        elif char == '}' and brace_depth > 0:
                            brace_depth -= 1
                            if brace_depth == 0:
                                # Found the end
                                result.append(template_content[start:j+1])
                                i = start + 1  # Continue searching from next position, not after the block
                                break
                    j += 1
            # Look for __blockScan
            elif template_content[i:].startswith('${this.__blockScan'):
                # Find the matching closing }
                start = i
                brace_depth = 0
                j = i
                in_string = False
                escape_next = False
                
                while j < len(template_content):
                    char = template_content[j]
                    
                    if escape_next:
                        escape_next = False
                        j += 1
                        continue
                    
                    if char == '\\':
                        escape_next = True
                        j += 1
                        continue
                    
                    if char == '`':
                        in_string = not in_string
                    
                    if not in_string:
                        if char == '{' and j > 0 and template_content[j-1] == '$':
                            brace_depth += 1
                        elif char == '}' and brace_depth > 0:
                            brace_depth -= 1
                            if brace_depth == 0:
                                # Found the end
                                result.append(template_content[start:j+1])
                                i = start + 1  # Continue searching from next position, not after the block
                                break
                    j += 1
            else:
                i += 1
        
        return '\n'.join(result)
    
    
    def generate_css_functions(self, view_name, css_content=None):
        """Generate CSS functions (addCSS, removeCSS)"""
        if css_content and any(css_content):
            # Separate inline CSS và external CSS
            inline_css = []
            external_css = []
            
            for css_item in css_content:
                if css_item.startswith('/* External CSS:'):
                    # Extract URL từ comment
                    import re
                    url_match = re.search(r'/\* External CSS: ([^*]+) \*/', css_item)
                    if url_match:
                        external_css.append(url_match.group(1).strip())
                else:
                    inline_css.append(css_item)
            
            # Generate inline CSS
            inline_css_text = '\n'.join(inline_css) if inline_css else ''
            inline_css_escaped = inline_css_text.replace('`', r'\`') if inline_css_text else ''
            
            # Generate external CSS loading
            external_css_loading = ''
            if external_css:
                external_css_loading = f"""
            // Load external CSS
            const externalCssUrls = {external_css};
            externalCssUrls.forEach(url => {{
                if (!document.querySelector(`link[href="${{url}}"][data-view-name="{view_name}"]`)) {{
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = url;
                    link.setAttribute('data-view-name', '{view_name}');
                    document.head.appendChild(link);
                }}
            }});"""
            
            return f"""
        addCSS: function() {{
            // Check if style tag with data-view-name doesn't exist
            if (!document.querySelector('style[data-view-name="{view_name}"]')) {{
                const style = document.createElement('style');
                style.setAttribute('data-view-name', '{view_name}');
                style.textContent = `{inline_css_escaped}`;
                document.head.appendChild(style);
            }}{external_css_loading}
        }},
        removeCSS: function() {{
            const styles = document.querySelectorAll('style[data-view-name="{view_name}"]');
            styles.forEach(style => style.remove());
            const links = document.querySelectorAll('link[data-view-name="{view_name}"]');
            links.forEach(link => link.remove());
        }}
"""
        else:
            return f"""
        addCSS: function() {{
            // No CSS content found in @onInit
        }},
        removeCSS: function() {{
            const styles = document.querySelectorAll('style[data-view-name="{view_name}"]');
            styles.forEach(style => style.remove());
        }}
"""
    
    def generate_load_server_data_function(self, vars_declaration, setup_script, directives_line):
        """Generate loadServerData function - similar to render but without template content and return"""
        # NOTE: vars_line and directives_line are now handled in wrapper scope
        # No need to call updateVariableData here
        update_call_line = ""  # Don't call updateVariableData
        
        # Create loadServerData function with same structure as render but without template
        load_server_data_func = f"""function() {{
    {update_call_line}{setup_script}
}}"""
        
        return load_server_data_func
