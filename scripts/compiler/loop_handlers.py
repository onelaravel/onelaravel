"""
Handlers cho các loop directives (@foreach, @for, etc.)
"""

from config import JS_FUNCTION_PREFIX
from php_converter import php_to_js
from utils import extract_balanced_parentheses
import re

class LoopHandlers:
    def __init__(self):
        pass
    
    def process_foreach_directive(self, line, stack, output):
        """Process @foreach directive"""
        foreach_pos = line.find('(')
        if foreach_pos != -1:
            foreach_content, end_pos = extract_balanced_parentheses(line, foreach_pos)
            if foreach_content is not None:
                as_match = re.match(r'\s*(.*?)\s+as\s+\$?(\w+)(\s*=>\s*\$?(\w+))?\s*$', foreach_content)
                if as_match:
                    array_expr = php_to_js(as_match.group(1))
                    first_var = as_match.group(2)
                    
                    if as_match.group(3):  # Has key => value
                        key_var = first_var
                        value_var = as_match.group(4)
                        callback = f'({value_var}, {key_var}, __loopIndex, loop) => `'
                    else:  # Only value
                        value_var = first_var
                        callback = f'({value_var}, __loopKey, __loopIndex, loop) => `'
                    
                    result = f"${{{JS_FUNCTION_PREFIX}.foreach({array_expr}, {callback}"
                    output.append(result)
                    stack.append(('foreach', len(output)))
                    return True
        return False
    
    def process_endforeach_directive(self, stack, output):
        """Process @endforeach directive"""
        if stack and stack[-1][0] == 'foreach':
            stack.pop()
            output.append('`)}')
        return True
    
    def process_for_directive(self, line, stack, output):
        """Process @for directive"""
        for_pos = line.find('(')
        if for_pos != -1:
            for_content, end_pos = extract_balanced_parentheses(line, for_pos)
            if for_content is not None:
                # Parse @for($i = 0; $i < 10; $i++)
                for_match = re.match(r'\s*\$?(\w+)\s*=\s*(.*?);\s*\$?\1\s*([<>=!]+)\s*(.*?);\s*\$?\1\s*\+\+\s*$', for_content)
                if for_match:
                    var_name = for_match.group(1)
                    start_value = php_to_js(for_match.group(2))
                    operator = for_match.group(3)
                    end_value = php_to_js(for_match.group(4))
                    
                    # Generate for loop with output variable
                    result = f"${{{JS_FUNCTION_PREFIX}.execute(() => {{\nlet __forOutputContent__ = ``;\nfor(let {var_name} = {start_value}; {var_name} {operator} {end_value}; {var_name}++) {{"
                    output.append(result)
                    stack.append(('for', len(output)))
                    return True
        return False
    
    def process_endfor_directive(self, stack, output):
        """Process @endfor directive"""
        if stack and stack[-1][0] == 'for':
            stack.pop()
            result = "\n}\nreturn __forOutputContent__;\n})}"
            return result
        return False
    
    def process_while_directive(self, line, stack, output):
        """Process @while directive"""
        while_pos = line.find('(')
        if while_pos != -1:
            while_content, end_pos = extract_balanced_parentheses(line, while_pos)
            if while_content is not None:
                condition = php_to_js(while_content)
                # Generate while loop with output variable
                result = f"${{{JS_FUNCTION_PREFIX}.execute(() => {{\nlet __whileOutputContent__ = ``;\nwhile({condition}) {{"
                output.append(result)
                stack.append(('while', len(output)))
                return True
        return False
    
    def process_endwhile_directive(self, stack, output):
        """Process @endwhile directive"""
        if stack and stack[-1][0] == 'while':
            stack.pop()
            result = "\n}\nreturn __whileOutputContent__;\n})}"
            return result
        return False
