"""
Processors cho template lines và các directives khác
"""

from config import JS_FUNCTION_PREFIX, SPA_YIELD_ATTR_PREFIX, SPA_YIELD_SUBSCRIBE_KEY_PREFIX, SPA_YIELD_SUBSCRIBE_TARGET_PREFIX, SPA_YIELD_SUBSCRIBE_ATTR_PREFIX, SPA_YIELD_CONTENT_PREFIX, SPA_YIELD_CHILDREN_PREFIX, SPA_STATECHANGE_PREFIX, APP_VIEW_NAMESPACE
from php_converter import php_to_js, convert_php_array_to_json
import re
import json

class TemplateProcessors:
    def __init__(self):
        pass
    
    def process_template_line(self, line):
        """Process a regular template line"""
        processed_line = line
        
        # Handle @yield directive in HTML content
        def replace_yield_directive(match):
            yield_content = match.group(1).strip()
            dollar_char = '$'
            yield_content_js = php_to_js(yield_content) if yield_content.startswith(dollar_char) else yield_content
            return "${" + JS_FUNCTION_PREFIX + ".yield(" + yield_content_js + ")}"
        
        processed_line = re.sub(r'@yield\s*\(\s*(.*?)\s*\)', replace_yield_directive, processed_line)
        
        # Handle @include directive
        def replace_include_directive(match):
            view_name = match.group(1).strip()
            variables = match.group(2).strip() if match.group(2) else '{}'
            variables_js = convert_php_array_to_json(variables)
            # Remove $ prefix from variables
            variables_js = re.sub(r'\$(\w+)', r'\1', variables_js)
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__include('" + view_name + "', " + variables_js + "))}"
        
        # Handle @include directive with PHP expressions (like $temp.'.ga-js')
        def replace_include_php_directive(match):
            view_expr = match.group(1).strip()
            variables = match.group(2).strip() if match.group(2) else '{}'
            variables_js = convert_php_array_to_json(variables)
            # Remove $ prefix from variables
            variables_js = re.sub(r'\$(\w+)', r'\1', variables_js)
            # Convert PHP expression to JavaScript
            view_expr_js = php_to_js(view_expr)
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__include(" + view_expr_js + ", " + variables_js + "))}"
        
        # Handle @include directive with PHP expressions and variables (improved for multiline)
        processed_line = re.sub(r'@include\s*\(\s*([^,\'"][^)]*?)\s*,\s*(\[[^\]]*\]|\{[^\}]*\}|[^)]*)\s*\)', replace_include_php_directive, processed_line, flags=re.DOTALL)
        
        # Handle @include directive with string literals and variables (improved for multiline arrays/objects)
        processed_line = re.sub(r'@include\s*\(\s*[\'"]([^\'"]*)[\'"]\s*,\s*(\[[^\]]*\]|\{[^\}]*\}|[^)]*)\s*\)', replace_include_directive, processed_line, flags=re.DOTALL)
        
        # Handle @include directive with PHP expressions without variables
        def replace_include_php_no_vars_directive(match):
            view_expr = match.group(1).strip()
            view_expr_js = php_to_js(view_expr)
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__include(" + view_expr_js + "))}"
        
        processed_line = re.sub(r'@include\s*\(\s*([^,\'"][^)]*?)\s*\)', replace_include_php_no_vars_directive, processed_line)
        
        # Handle @include directive with string literals without variables
        processed_line = re.sub(r'@include\s*\(\s*[\'"]([^\'"]*)[\'"]\s*\)', r'${' + APP_VIEW_NAMESPACE + r'.renderView(this.__include("\1", {}))}', processed_line)
        
        # Handle @includeif/@includeFf directive with path and data (2 parameters)
        def replace_includeif_2params_directive(match):
            view_path = match.group(1).strip()
            data = match.group(2).strip()
            
            # Convert view path to JavaScript
            if view_path.startswith('"') and view_path.endswith('"'):
                view_path_js = view_path
            elif view_path.startswith("'") and view_path.endswith("'"):
                view_path_js = f'"{view_path[1:-1]}"'
            else:
                view_path_js = php_to_js(view_path)
            
            # Convert data to JavaScript
            data_js = convert_php_array_to_json(data)
            data_js = re.sub(r'\$(\w+)', r'\1', data_js)
            
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__includeif(" + view_path_js + ", " + data_js + "))}"
        
        # Handle @includeif directive with variables
        def replace_includeif_directive(match):
            view_name = match.group(1).strip()
            variables = match.group(2).strip() if match.group(2) else '{}'
            variables_js = convert_php_array_to_json(variables)
            # Remove $ prefix from variables
            variables_js = re.sub(r'\$(\w+)', r'\1', variables_js)
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__includeif('" + view_name + "', " + variables_js + "))}"
        
        # Handle @includeif with PHP expressions (must be before string literal patterns)
        processed_line = re.sub(r'@includeif\s*\(\s*([^,]+?)\s*,\s*(\[.*?\])\s*\)', replace_includeif_2params_directive, processed_line, flags=re.IGNORECASE)
        
        processed_line = re.sub(r'@includeif\s*\(\s*[\'"]([^\'"]*)[\'"]\s*,\s*(.*?)\s*\)', replace_includeif_directive, processed_line, flags=re.DOTALL | re.IGNORECASE)
        
        # Handle @includeIf directive without variables (case insensitive)
        processed_line = re.sub(r'@includeif\s*\(\s*[\'"]([^\'"]*)[\'"]\s*\)', r'${' + APP_VIEW_NAMESPACE + r'.renderView(this.__includeif("\1", {}))}', processed_line, flags=re.IGNORECASE)
        
        # Handle @includeWhen/@includewhen directive with condition, path, and data
        def replace_includewhen_directive(match):
            condition = match.group(1).strip()
            view_path = match.group(2).strip()
            data = match.group(3).strip() if match.group(3) else '{}'
            
            # Convert condition to JavaScript
            condition_js = php_to_js(condition)
            
            # Convert view path to JavaScript
            if view_path.startswith('"') and view_path.endswith('"'):
                view_path_js = view_path
            elif view_path.startswith("'") and view_path.endswith("'"):
                view_path_js = f'"{view_path[1:-1]}"'
            else:
                view_path_js = php_to_js(view_path)
            
            # Convert data to JavaScript
            data_js = convert_php_array_to_json(data)
            data_js = re.sub(r'\$(\w+)', r'\1', data_js)
            
            return "${" + APP_VIEW_NAMESPACE + ".renderView(this.__includewhen(" + condition_js + ", " + view_path_js + ", " + data_js + "))}"
        
        # Handle @includeWhen/@includewhen with 3 parameters
        processed_line = re.sub(r'@includewhen\s*\(\s*([^,]+?)\s*,\s*([^,]+?)\s*,\s*([^)]+?)\s*\)', replace_includewhen_directive, processed_line, flags=re.IGNORECASE)
        
        # Handle @wrap/@wrapper directive
        def replace_wrap_directive(match):
            expression = match.group(1).strip() if match.group(1) else ''
            
            # Case 1: @wrap() or @wrap (no parameters)
            if not expression:
                return '__WRAPPER_CONFIG__ = { enable: true };'
            
            # Parse expression to determine case
            if expression.startswith('[') and expression.endswith(']'):
                # Case 3: @wrap($attributes)
                attributes = self._parse_wrap_attributes(expression)
                return self._generate_wrapper_config(attributes)
            else:
                # Case 2: @wrap($tag, $attributes)
                parts = self._parse_wrap_expression(expression)
                tag = parts['tag']
                attributes = parts['attributes']
                return self._generate_wrapper_config(attributes, tag)
        
        # Handle @wrap/@wrapper with parameters
        processed_line = re.sub(r'@(?:wrap|wrapper)\s*\(\s*([^)]*?)\s*\)', replace_wrap_directive, processed_line, flags=re.IGNORECASE)
        
        # Handle @wrap/@wrapper without parameters
        processed_line = re.sub(r'@(?:wrap|wrapper)(?:\s*\(\s*\))?\s*$', '__WRAPPER_CONFIG__ = { enable: true };', processed_line, flags=re.IGNORECASE)
        
        # Handle @endWrap/@endWrapper - keep as marker
        processed_line = re.sub(r'@end(?:wrap|wrapper)(?:\s*\(\s*\))?\s*$', '__WRAPPER_END__', processed_line, flags=re.IGNORECASE)
        
        # Handle @template directive - alias of @wrap with enhanced parameter syntax
        def replace_template_directive(match):
            expression = match.group(1).strip() if match.group(1) else ''
            
            if not expression:
                return '__WRAPPER_CONFIG__ = { enable: true };'
            
            # Parse template parameters and convert to wrapper format
            attributes = self._parse_template_parameters(expression)
            tag = attributes.pop('tag', None)
            
            # Process subscribe parameter specially
            if 'subscribe' in attributes:
                subscribe_value = attributes['subscribe']
                attributes['subscribe'] = self._process_subscribe_value(subscribe_value)
            
            return self._generate_wrapper_config(attributes, tag)
        
        # Handle @template with parameters (multiline support)
        processed_line = re.sub(r'@template\s*\(([^)]*)\)', replace_template_directive, processed_line, flags=re.IGNORECASE | re.DOTALL)
        
        # Handle @template without parameters
        processed_line = re.sub(r'@template(?:\s*\(\s*\))?\s*$', '__WRAPPER_CONFIG__ = { enable: true };', processed_line, flags=re.IGNORECASE)
        
        # Handle @endtemplate - keep as marker
        processed_line = re.sub(r'@endtemplate(?:\s*\(\s*\))?\s*$', '__WRAPPER_END__', processed_line, flags=re.IGNORECASE)
        
        # Handle @yieldAttr directive - improved to group multiple directives
        def process_multiple_yieldattr(line):
            """Process multiple @yieldattr directives and group them into single on-subscribe-attr"""
            import re
            
            # Find all on-yield-attr attributes
            yieldattr_pattern = r'@yieldattr\s*\(\s*[\'"]([^\'"]*)[\'"]\s*,\s*[\'"]([^\'"]*)[\'"]\s*(?:,\s*[\'"]([^\'"]*)[\'"])?\s*\)'
            matches = list(re.finditer(yieldattr_pattern, line, re.IGNORECASE))
            
            if not matches:
                return line
            
            # Collect all attributes and subscribe mappings
            attributes = []
            subscribe_attrs = []
            
            for match in matches:
                attr_key = match.group(1).strip().strip("'\"")
                yield_key = match.group(2).strip().strip("'\"")
                default_value = match.group(3).strip() if match.group(3) else 'null'
                
                if default_value != 'null':
                    default_value = default_value.strip("'\"")
                    default_value = f"'{default_value}'"
                
                # Add attribute
                attributes.append(f'{attr_key}="${{{JS_FUNCTION_PREFIX}.yieldContent(\'{yield_key}\', {default_value})}}"')
                # Add to subscribe mapping
                subscribe_attrs.append(f'{attr_key}:{yield_key}')
            
            # Replace all @yieldattr with combined result
            result = line
            for match in reversed(matches):  # Process in reverse order to maintain positions
                result = result[:match.start()] + '' + result[match.end():]
            
            # Add all attributes and single subscribe attribute
            attributes_str = ' '.join(attributes)
            subscribe_str = f'{SPA_YIELD_SUBSCRIBE_ATTR_PREFIX}="{",".join(subscribe_attrs)}"'
            
            # Find the position to insert (after the last attribute)
            insert_pos = result.find('>')
            if insert_pos != -1:
                result = result[:insert_pos] + ' ' + attributes_str + ' ' + subscribe_str + result[insert_pos:]
            
            return result
        
        # Handle @yieldon/@onyield/@yieldListen/@yieldWatch directive with array syntax
        def replace_yieldon_array_directive(match):
            array_content = match.group(1).strip()
            # Parse array content: ['attrKey' => 'yieldKey', '#key' => 'yieldKey', ...]
            result = []
            subscribe_attrs = []
            
            # Split by comma but respect quotes and brackets
            items = []
            current_item = ""
            in_quotes = False
            quote_char = ""
            paren_count = 0
            
            for char in array_content:
                if (char == '"' or char == "'") and not in_quotes:
                    in_quotes = True
                    quote_char = char
                elif char == quote_char and in_quotes:
                    in_quotes = False
                    quote_char = ""
                elif not in_quotes:
                    if char == '[':
                        paren_count += 1
                    elif char == ']':
                        paren_count -= 1
                    elif char == ',' and paren_count == 0:
                        items.append(current_item.strip())
                        current_item = ""
                        continue
                
                current_item += char
            
            if current_item.strip():
                items.append(current_item.strip())
            
            # Process each item
            for item in items:
                if '=>' in item:
                    key, value = item.split('=>', 1)
                    key = key.strip().strip("'\"")
                    value = value.strip().strip("'\"")
                    
                    # Remove $ prefix from value (state variable)
                    if value.startswith('$'):
                        value = value[1:]
                    
                    if key == '#content':
                        # Special key #content
                        result.append(f'{SPA_YIELD_CONTENT_PREFIX}="{value}"')
                    elif key == '#children':
                        # Special key #children
                        result.append(f'{SPA_YIELD_CHILDREN_PREFIX}="{value}"')
                    else:
                        # Regular attribute - create attribute with yieldContent
                        result.append(f'{key}="${{{JS_FUNCTION_PREFIX}.yieldContent(\'{value}\', null)}}"')
                        subscribe_attrs.append(f'{key}:{value}')
            
            # Add subscribe attribute if there are regular attributes
            if subscribe_attrs:
                result.append(f'{SPA_YIELD_SUBSCRIBE_ATTR_PREFIX}="{",".join(subscribe_attrs)}"')
            
            return ' '.join(result)
        
        # Handle @yieldon/@onyield/@yieldListen/@yieldWatch directive with array syntax
        # Handle @yieldon/@onyield/@yieldListen/@yieldWatch directive with array syntax - more specific regex to avoid conflicts
        processed_line = re.sub(r'@(?:yieldon|onyield|yieldlisten|yieldwatch)\s*\(\s*\[([^\[\]]*(?:\[[^\[\]]*\][^\[\]]*)*)\]\s*\)', replace_yieldon_array_directive, processed_line, flags=re.DOTALL | re.IGNORECASE)
        
        # Handle @yieldon/@onyield/@yieldListen/@yieldWatch directive with simple syntax
        def replace_yieldon_directive(match):
            attr_key = match.group(1).strip()
            yield_key = match.group(2).strip()
            default_value = match.group(3).strip() if match.group(3) else 'null'
            # Remove quotes from parameters
            attr_key = attr_key.strip("'\"")
            yield_key = yield_key.strip("'\"")
            if default_value != 'null':
                default_value = default_value.strip("'\"")
                default_value = f"'{default_value}'"
            
            # Create attribute with yieldContent
            result = f'{attr_key}="${{{JS_FUNCTION_PREFIX}.yieldContent(\'{yield_key}\', {default_value})}}"'
            # Add subscribe attribute
            result += f' {SPA_YIELD_SUBSCRIBE_ATTR_PREFIX}="{attr_key}:{yield_key}"'
            return result
        
        processed_line = re.sub(r'@(?:yieldon|onyield|yieldlisten|yieldwatch)\s*\(\s*[\'"]([^\'"]*)[\'"]\s*,\s*[\'"]([^\'"]*)[\'"]\s*(?:,\s*[\'"]([^\'"]*)[\'"])?\s*\)', replace_yieldon_directive, processed_line, flags=re.IGNORECASE)
        
        # Handle @yieldAttr directive - process after @yieldon to avoid conflicts
        processed_line = process_multiple_yieldattr(processed_line)
        
        # Handle @subscribe directive with array syntax
        def replace_subscribe_array_directive(match):
            array_content = match.group(1).strip()
            # Parse array content: ['attrkey' => $stateKey, '#children' => $childrenState, '#content' => $contentState]
            result = []
            
            # Split by comma but respect quotes and brackets
            items = []
            current_item = ""
            in_quotes = False
            quote_char = ""
            paren_count = 0
            
            for char in array_content:
                if (char == '"' or char == "'") and not in_quotes:
                    in_quotes = True
                    quote_char = char
                elif char == quote_char and in_quotes:
                    in_quotes = False
                    quote_char = ""
                elif not in_quotes:
                    if char == '[':
                        paren_count += 1
                    elif char == ']':
                        paren_count -= 1
                    elif char == ',' and paren_count == 0:
                        items.append(current_item.strip())
                        current_item = ""
                        continue
                
                current_item += char
            
            if current_item.strip():
                items.append(current_item.strip())
            
            # Process each item
            for item in items:
                if '=>' in item:
                    key, value = item.split('=>', 1)
                    key = key.strip().strip("'\"")
                    value = value.strip().strip("'\"")
                    
                    # Remove $ prefix from state variable
                    if value.startswith('$'):
                        state_key = value[1:]
                    else:
                        state_key = value
                    
                    if key == '#children':
                        # Special key #children
                        result.append(f'{SPA_STATECHANGE_PREFIX}{state_key}="#children"')
                    elif key == '#content':
                        # Special key #content
                        result.append(f'{SPA_STATECHANGE_PREFIX}{state_key}="#content"')
                    else:
                        # Regular attribute
                        result.append(f'{SPA_STATECHANGE_PREFIX}{state_key}="{key}"')
            
            return ' '.join(result)
        
        # Handle @subscribe directive with new approach
        def replace_subscribe_directive(match):
            full_match = match.group(0)
            # Extract the content inside parentheses
            paren_match = re.search(r'@subscribe\s*\((.*)\)', full_match, re.IGNORECASE)
            if not paren_match:
                return full_match
            
            content = paren_match.group(1).strip()
            
            # Case 1: Single parameter - @subscribe($stateKey)
            single_match = re.match(r'^\$?(\w+)$', content)
            if single_match:
                state_key = single_match.group(1)
                return f'${{this.__subscribe({{\"#all\": [\"{state_key}\"]}})}}'
            
            # Case 2: Two parameters - @subscribe($stateKey, 'attrKey') or @subscribe($stateKey, "#children")
            two_params_match = re.match(r'^\$?(\w+)\s*,\s*[\'"]([^\'"]*)[\'"]$', content)
            if two_params_match:
                state_key = two_params_match.group(1)
                attr_key = two_params_match.group(2)
                return f'${{this.__subscribe({{\"{attr_key}\": [\"{state_key}\"]}})}}'
            
            # Case 3: Array of state variables - @subscribe([$stateKey, $contentState])
            if content.startswith('[') and content.endswith(']'):
                array_content = content[1:-1].strip()
                # Check if it contains => (key-value pairs) or just state variables
                if '=>' in array_content:
                    # Case 4: Array with key-value pairs - @subscribe(['attrKey' => $stateKey, ...])
                    return process_subscribe_array_keyvalue(array_content)
                else:
                    # Case 3: Array of state variables - @subscribe([$stateKey, $contentState])
                    state_keys = parse_state_array(array_content)
                    return f'${{this.__subscribe({{\"#all\": {json.dumps(state_keys)}}})}}'
            
            # Case 5: Array with second parameter - @subscribe([$stateKey, $contentState], "#children")
            array_with_attr_match = re.match(r'^\[([^\]]+)\]\s*,\s*[\'"]([^\'"]*)[\'"]$', content)
            if array_with_attr_match:
                array_content = array_with_attr_match.group(1).strip()
                attr_key = array_with_attr_match.group(2)
                state_keys = parse_state_array(array_content)
                return f'${{this.__subscribe({{\"{attr_key}\": {json.dumps(state_keys)}}})}}'
            
            return full_match
        
        def parse_state_array(array_content):
            """Parse array content and extract state keys"""
            state_keys = []
            items = []
            current_item = ""
            in_quotes = False
            quote_char = ""
            paren_count = 0
            
            for char in array_content:
                if (char == '"' or char == "'") and not in_quotes:
                    in_quotes = True
                    quote_char = char
                    current_item += char
                elif char == quote_char and in_quotes:
                    in_quotes = False
                    quote_char = ""
                    current_item += char
                elif char == '[' and not in_quotes:
                    paren_count += 1
                    current_item += char
                elif char == ']' and not in_quotes:
                    paren_count -= 1
                    current_item += char
                elif char == ',' and not in_quotes and paren_count == 0:
                    if current_item.strip():
                        items.append(current_item.strip())
                    current_item = ""
                else:
                    current_item += char
            
            if current_item.strip():
                items.append(current_item.strip())
            
            # Process each item
            for item in items:
                item = item.strip()
                # Remove $ prefix from state variable
                if item.startswith('$'):
                    state_key = item[1:]
                else:
                    state_key = item
                state_keys.append(state_key)
            
            return state_keys
        
        def process_subscribe_array_keyvalue(array_content):
            """Process array with key-value pairs"""
            result = {}
            
            # Split by comma but respect quotes and brackets
            items = []
            current_item = ""
            in_quotes = False
            quote_char = ""
            paren_count = 0
            
            for char in array_content:
                if (char == '"' or char == "'") and not in_quotes:
                    in_quotes = True
                    quote_char = char
                    current_item += char
                elif char == quote_char and in_quotes:
                    in_quotes = False
                    quote_char = ""
                    current_item += char
                elif char == '[' and not in_quotes:
                    paren_count += 1
                    current_item += char
                elif char == ']' and not in_quotes:
                    paren_count -= 1
                    current_item += char
                elif char == ',' and not in_quotes and paren_count == 0:
                    if current_item.strip():
                        items.append(current_item.strip())
                    current_item = ""
                else:
                    current_item += char
            
            if current_item.strip():
                items.append(current_item.strip())
            
            # Process each key-value pair
            for item in items:
                item = item.strip()
                if '=>' in item:
                    key, value = item.split('=>', 1)
                    key = key.strip().strip('"\'')
                    value = value.strip()
                    
                    # Check if value is an array
                    if value.startswith('[') and value.endswith(']'):
                        # Array of state variables
                        array_content = value[1:-1].strip()
                        state_keys = parse_state_array(array_content)
                        result[key] = state_keys
                    else:
                        # Single state variable
                        if value.startswith('$'):
                            state_key = value[1:]
                        else:
                            state_key = value
                        result[key] = [state_key]
            
            return f'${{this.__subscribe({json.dumps(result)})}}'
        
        # Apply the new subscribe directive processing
        processed_line = re.sub(r'@subscribe\s*\([^)]*\)', replace_subscribe_directive, processed_line, flags=re.IGNORECASE)
        
        # Handle @wrap/@wrapAttr/@wrapattr directive
        def replace_wrap_directive(match):
            return '${this.wrapattr()}'
        
        # Only match @wrap directives that are in HTML tag attributes (not in text content)
        # Look for patterns like: <tag @wrap class="..."> or <tag @wrap>
        processed_line = re.sub(r'<([^>]*?)\s@(?:wrap|wrapAttr|wrapattr)\s*(?:\([^)]*\))?\s*([^>]*?)>', r'<\1 \2 ${this.wrapattr()}>', processed_line, flags=re.IGNORECASE)
        
        # Merge multiple on-yield-attr attributes into one
        def merge_yield_attr_attributes(line):
            """Merge multiple on-yield-attr attributes into a single one"""
            import re
            
            # Find all on-yield-attr attributes
            yield_attr_pattern = r'on-yield-attr="([^"]*)"'
            matches = list(re.finditer(yield_attr_pattern, line))
            
            if len(matches) <= 1:
                return line
            
            # Collect all attribute mappings
            all_attrs = []
            for match in matches:
                attrs = match.group(1).split(',')
                all_attrs.extend([attr.strip() for attr in attrs if attr.strip()])
            
            # Remove duplicates while preserving order
            seen = set()
            unique_attrs = []
            for attr in all_attrs:
                if attr not in seen:
                    seen.add(attr)
                    unique_attrs.append(attr)
            
            # Replace all on-yield-attr with single one
            result = line
            for match in reversed(matches):  # Process in reverse order
                result = result[:match.start()] + '' + result[match.end():]
            
            # Add single merged on-yield-attr
            merged_attr = f'on-yield-attr="{",".join(unique_attrs)}"'
            insert_pos = result.find('>')
            if insert_pos != -1:
                result = result[:insert_pos] + ' ' + merged_attr + result[insert_pos:]
            
            return result
        
        processed_line = merge_yield_attr_attributes(processed_line)
        
        # Handle @viewId directive
        processed_line = re.sub(r'@viewId', "${" + JS_FUNCTION_PREFIX + ".generateViewId()}", processed_line)
        
        # Handle {!! ... !!} (unescaped output)
        def replace_unescaped(match):
            expr = match.group(1).strip()
            js_expr = php_to_js(expr)
            return '${' + js_expr + '}'
        processed_line = re.sub(r'{\!!\s*(.*?)\s*!!}', replace_unescaped, processed_line)
        
        # Handle {{ ... }} (escaped output)
        def replace_echo(match):
            expr = match.group(1).strip()
            js_expr = php_to_js(expr)
            
            # Check if this is a complex structure (array/object) that shouldn't be escaped
            # More sophisticated check for nested structures
            if self._is_complex_structure(js_expr):
                return "${" + js_expr + "}"
            else:
                return "${" + JS_FUNCTION_PREFIX + ".escString(" + js_expr + ")}"
        processed_line = re.sub(r'{{\s*(.*?)\s*}}', replace_echo, processed_line)
        
        # Handle { ... } (simple variable output)
        def replace_simple_var(match):
            expr = match.group(1).strip()
            js_expr = php_to_js(expr)
            return "${" + js_expr + "}"
        processed_line = re.sub(r'{\s*\$(\w+)\s*}', replace_simple_var, processed_line)
        
        # Handle {{ $var }} syntax - convert to ${App.View.escString(var)}
        def replace_php_variable(match):
            var_name = match.group(1).strip()
            # Remove $ prefix if present
            if var_name.startswith('$'):
                var_name = var_name[1:]
            return f'${{{APP_VIEW_NAMESPACE}.escString({var_name})}}'
        
        processed_line = re.sub(r'\{\{\s*\$(\w+)\s*\}\}', replace_php_variable, processed_line)
        
        # Handle @useState directive - remove from template (already processed in main_compiler.py)
        processed_line = re.sub(r'@useState\s*\([^)]*\)', '', processed_line, flags=re.IGNORECASE)
        
        return processed_line
    
    def _parse_wrap_expression(self, expression):
        """Parse @wrap($tag, $attributes) expression"""
        # Find comma separator
        comma_pos = -1
        in_quote = False
        quote_char = None
        
        for i in range(len(expression)):
            char = expression[i]
            
            if (char == '"' or char == "'") and (i == 0 or expression[i-1] != '\\'):
                if not in_quote:
                    in_quote = True
                    quote_char = char
                elif char == quote_char:
                    in_quote = False
                    quote_char = None
            
            if not in_quote and char == ',':
                comma_pos = i
                break
        
        if comma_pos == -1:
            # Only tag, no attributes
            tag = expression.strip().strip('\'"')
            return {'tag': tag, 'attributes': []}
        
        # Both tag and attributes
        tag_part = expression[:comma_pos].strip().strip('\'"')
        attributes_part = expression[comma_pos + 1:].strip()
        
        return {'tag': tag_part, 'attributes': self._parse_wrap_attributes(attributes_part)}
    
    def _parse_wrap_attributes(self, attributes_str):
        """Parse attributes array from string"""
        attributes_str = attributes_str.strip()
        
        # Remove brackets
        if attributes_str.startswith('[') and attributes_str.endswith(']'):
            attributes_str = attributes_str[1:-1]
        
        if not attributes_str:
            return {}
        
        # Use regex to parse key-value pairs
        attributes = {}
        
        # Pattern to match 'key' => 'value' or 'key' => value
        pattern = r"['\"]?([^'\"]+)['\"]?\s*=>\s*(.*?)(?=,\s*['\"]?[^'\"]+['\"]?\s*=>|$)"
        matches = re.findall(pattern, attributes_str)
        
        for key, value in matches:
            key = key.strip()
            value = value.strip().strip('\'"')
            
            # Handle follow parameter specially
            if key == 'follow':
                if value == 'false':
                    attributes[key] = False
                elif value.startswith('[') and value.endswith(']'):
                    # Array of variables
                    array_content = value[1:-1]
                    variables = [v.strip().strip('\'"') for v in array_content.split(',')]
                    attributes[key] = variables
                else:
                    # Single variable
                    attributes[key] = value
            elif key == 'subscribe':
                # Handle subscribe parameter similar to follow, with boolean support
                if value == 'false':
                    attributes[key] = False
                elif value == 'true':
                    attributes[key] = True
                elif value.startswith('[') and value.endswith(']'):
                    array_content = value[1:-1]
                    variables = [v.strip().strip('\'"') for v in array_content.split(',')]
                    attributes[key] = variables
                else:
                    attributes[key] = value
            else:
                attributes[key] = value
        
        return attributes
    
    def _process_subscribe_value(self, subscribe_str):
        """Process subscribe value to extract variable names
        Input: "[$statekey]" or "[$user, $posts]" or "false" or "$key"
        Output: ["statekey"] or ["user", "posts"] or False or ["key"]
        """
        subscribe_str = str(subscribe_str).strip()
        
        # Handle boolean values
        if subscribe_str.lower() == 'false' or subscribe_str == 'False':
            return False
        if subscribe_str.lower() == 'true' or subscribe_str == 'True':
            return True
        
        # Handle array syntax: [$var1, $var2, ...]
        if subscribe_str.startswith('[') and subscribe_str.endswith(']'):
            # Remove brackets
            inner = subscribe_str[1:-1].strip()
            if not inner:
                return []
            
            # Split by comma and extract variable names
            variables = []
            for var in inner.split(','):
                var = var.strip().lstrip('$')
                if var:
                    variables.append(var)
            return variables
        
        # Handle single variable: $var
        if subscribe_str.startswith('$'):
            return [subscribe_str[1:]]
        
        # Already processed or literal
        return subscribe_str
    
    def _parse_template_parameters(self, params_str):
        """Parse template parameters from various formats:
        - Positional: $tag = '...', $subscribe = [...], $attr1 = '...', ...
        - Named: tag: '...', subscribe: [...], attr1: '...', ...
        - Array: ['tag' => '...', 'subscribe' => [...], ...]
        - First param as tag: 'section', $subscribe = [...]
        """
        params_str = params_str.strip()
        
        # Check if it's array syntax
        if params_str.startswith('[') and params_str.endswith(']'):
            return self._parse_wrap_attributes(params_str)
        
        # Check if it's named parameter syntax (contains colons)
        if self._is_named_parameter_syntax(params_str):
            return self._parse_named_parameters(params_str)
        
        # Parse as positional parameters with defaults
        return self._parse_positional_parameters(params_str)
    
    def _is_named_parameter_syntax(self, params_str):
        """Check if expression uses named parameter syntax (key: value)"""
        in_quote = False
        quote_char = None
        bracket_depth = 0
        
        for i, char in enumerate(params_str):
            # Handle quotes
            if char in ['"', "'"] and (i == 0 or params_str[i-1] != '\\'):
                if not in_quote:
                    in_quote = True
                    quote_char = char
                elif char == quote_char:
                    in_quote = False
                    quote_char = None
            
            # Handle brackets
            if not in_quote:
                if char == '[':
                    bracket_depth += 1
                elif char == ']':
                    bracket_depth -= 1
            
            # Check for colon (not inside quotes or brackets, not part of ::)
            if not in_quote and bracket_depth == 0 and char == ':':
                if (i + 1 >= len(params_str) or params_str[i + 1] != ':') and \
                   (i == 0 or params_str[i - 1] != ':'):
                    return True
        
        return False
    
    def _parse_named_parameters(self, params_str):
        """Parse named parameters: key: value, key2: value2, ..."""
        return self._parse_key_value_pairs(params_str, ':')
    
    def _parse_positional_parameters(self, params_str):
        """Parse positional parameters: $tag = '...', $subscribe = [...], ..."""
        attributes = {}
        parts = self._split_params_by_comma(params_str)
        
        for part in parts:
            part = part.strip()
            
            # Check if it's an assignment: $varName = value or varName = value
            match = re.match(r'^\s*\$?(\w+)\s*=\s*(.+)$', part, re.DOTALL)
            if match:
                key = match.group(1)
                value = match.group(2).strip()
                attributes[key] = value
            else:
                # If no assignment, treat as 'tag' parameter
                if 'tag' not in attributes:
                    # Remove quotes if present
                    attributes['tag'] = part.strip('\'"')
        
        return attributes
    
    def _parse_key_value_pairs(self, params_str, separator):
        """Parse key-value pairs with given separator (=> or :)"""
        attributes = {}
        parts = self._split_params_by_comma(params_str)
        
        for part in parts:
            part = part.strip()
            
            # Find separator position (not inside quotes or brackets)
            sep_pos = self._find_separator_position(part, separator)
            
            if sep_pos is not None:
                key = part[:sep_pos].strip().strip('\'"').lstrip('$')
                value = part[sep_pos + len(separator):].strip()
                attributes[key] = value
        
        return attributes
    
    def _find_separator_position(self, expression, separator):
        """Find separator position outside quotes and brackets"""
        in_quote = False
        quote_char = None
        bracket_depth = 0
        sep_len = len(separator)
        
        for i, char in enumerate(expression):
            # Handle quotes
            if char in ['"', "'"] and (i == 0 or expression[i-1] != '\\'):
                if not in_quote:
                    in_quote = True
                    quote_char = char
                elif char == quote_char:
                    in_quote = False
                    quote_char = None
            
            # Handle brackets
            if not in_quote:
                if char == '[':
                    bracket_depth += 1
                elif char == ']':
                    bracket_depth -= 1
            
            # Check for separator
            if not in_quote and bracket_depth == 0:
                if expression[i:i+sep_len] == separator:
                    # For ':', make sure it's not '::'
                    if separator == ':':
                        not_double_colon = (i + 1 >= len(expression) or expression[i + 1] != ':') and \
                                          (i == 0 or expression[i - 1] != ':')
                        if not_double_colon:
                            return i
                    else:
                        return i
        
        return None
    
    def _split_params_by_comma(self, expression):
        """Split expression by comma (respecting quotes, brackets, and parentheses)"""
        parts = []
        current = ''
        in_quote = False
        quote_char = None
        bracket_depth = 0
        paren_depth = 0
        
        for i, char in enumerate(expression):
            # Handle quotes
            if char in ['"', "'"] and (i == 0 or expression[i-1] != '\\'):
                if not in_quote:
                    in_quote = True
                    quote_char = char
                elif char == quote_char:
                    in_quote = False
                    quote_char = None
            
            # Handle brackets and parentheses
            if not in_quote:
                if char == '[':
                    bracket_depth += 1
                elif char == ']':
                    bracket_depth -= 1
                elif char == '(':
                    paren_depth += 1
                elif char == ')':
                    paren_depth -= 1
            
            # Split on comma only if not inside quotes, brackets, or parentheses
            if not in_quote and bracket_depth == 0 and paren_depth == 0 and char == ',':
                if current.strip():
                    parts.append(current)
                current = ''
            else:
                current += char
        
        # Add the last part
        if current.strip():
            parts.append(current)
        
        return parts
    
    def _generate_wrapper_config(self, attributes, tag=None):
        """Generate wrapperConfig object"""
        config_parts = ['enable: true']
        
        # Always add tag field (null if not provided)
        if tag:
            config_parts.append(f'tag: "{tag}"')
        else:
            config_parts.append('tag: null')
        
        # Handle follow parameter
        follow = attributes.pop('follow', None)
        if follow is not None:
            if follow == 'false' or follow is False:
                config_parts.append('follow: false')
            elif isinstance(follow, str):
                # Single variable
                if follow.startswith('$'):
                    follow = follow[1:]
                config_parts.append(f'follow: ["{follow}"]')
            elif isinstance(follow, list):
                # Array of variables
                processed_follow = []
                for item in follow:
                    if isinstance(item, str) and item.startswith('$'):
                        processed_follow.append(f'"{item[1:]}"')
                    else:
                        processed_follow.append(f'"{item}"')
                config_parts.append(f'follow: [{", ".join(processed_follow)}]')

        # Handle subscribe parameter
        subscribe = attributes.pop('subscribe', None)
        if subscribe is not None:
            if subscribe == 'false' or subscribe is False:
                config_parts.append('subscribe: false')
            elif subscribe == 'true' or subscribe is True:
                config_parts.append('subscribe: true')
            elif isinstance(subscribe, str):
                if subscribe.startswith('$'):
                    subscribe = subscribe[1:]
                config_parts.append(f'subscribe: ["{subscribe}"]')
            elif isinstance(subscribe, list):
                processed = []
                for item in subscribe:
                    if isinstance(item, str) and item.startswith('$'):
                        processed.append(f'"{item[1:]}"')
                    else:
                        processed.append(f'"{item}"')
                config_parts.append(f'subscribe: [{", ".join(processed)}]')
        
        # Handle other attributes
        if attributes:
            attrs_js = convert_php_array_to_json(str(attributes))
            attrs_js = re.sub(r'\$(\w+)', r'\1', attrs_js)
            config_parts.append(f'attributes: {attrs_js}')
        else:
            config_parts.append('attributes: {}')
        
        return f'__WRAPPER_CONFIG__ = {{ {", ".join(config_parts)} }};'
    
    def _is_complex_structure(self, expr):
        """Check if expression is a complex structure (array/object) that shouldn't be escaped"""
        expr = expr.strip()
        
        # Check for array syntax
        if expr.startswith('[') and expr.endswith(']'):
            return True
            
        # Check for object syntax
        if expr.startswith('{') and expr.endswith('}'):
            return True
            
        # Check for nested structures (more sophisticated)
        if '[' in expr and ']' in expr and '=>' in expr:
            return True
            
        if '{' in expr and '}' in expr and ':' in expr:
            return True
            
        return False
    
    def process_serverside_directive(self, line):
        """Process @serverside/@serverSide directive and aliases"""
        serverside_aliases = [
            '@serverside', '@serverSide', '@ssr', '@SSR', '@useSSR', '@useSsr'
        ]
        
        if any(line.startswith(alias) for alias in serverside_aliases):
            return 'skip_until_@endserverside'
        return False
    
    def process_clientside_directive(self, line):
        """Process @clientside/@endclientside directive and aliases"""
        clientside_aliases = [
            '@clientside', '@clientSide', '@csr', '@CSR', '@useCSR', '@useCsr'
        ]
        
        if any(line.startswith(alias) for alias in clientside_aliases):
            return 'remove_directive_markers_until_@endclientside'
        return False
