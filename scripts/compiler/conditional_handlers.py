"""
Handlers cho các conditional directives (@if, @switch, etc.)
"""

from config import JS_FUNCTION_PREFIX
from php_converter import php_to_js
from utils import extract_balanced_parentheses
import re

class ConditionalHandlers:
    def __init__(self):
        pass
    
    def process_if_directive(self, line, stack, output):
        """Process @if directive"""
        if_pos = line.find('(')
        if if_pos != -1:
            condition_text, end_pos = extract_balanced_parentheses(line, if_pos)
            if condition_text is not None:
                condition = php_to_js(condition_text.strip())
                result = f"${{{JS_FUNCTION_PREFIX}.execute(() => {{ if({condition}){{ return `"
                output.append(result)
                stack.append(('if', len(output)))
                return True
        return False
    
    def process_elseif_directive(self, line, stack, output):
        """Process @elseif directive"""
        elseif_pos = line.find('(')
        if elseif_pos != -1:
            condition_text, end_pos = extract_balanced_parentheses(line, elseif_pos)
            if condition_text is not None:
                condition = php_to_js(condition_text.strip())
                result = f"`; }} else if({condition}){{ return `"
                output.append(result)
                return True
        return False
    
    def process_else_directive(self, line, stack, output):
        """Process @else directive"""
        result = f"`; }} else {{ return `"
        output.append(result)
        return True
    
    def process_endif_directive(self, stack, output):
        """Process @endif directive"""
        if stack and stack[-1][0] == 'if':
            stack.pop()
            output.append('`; }')
            output.append("return '';")
            output.append('})}')
        return True
    
    def process_switch_directive(self, line, stack, output):
        """Process @switch directive"""
        switch_pos = line.find('(')
        if switch_pos != -1:
            switch_content, end_pos = extract_balanced_parentheses(line, switch_pos)
            if switch_content is not None:
                condition = php_to_js(switch_content.strip())
                # Generate switch statement with output variable
                result = f"${{{JS_FUNCTION_PREFIX}.execute(() => {{\nlet __switchOutputContent__ = '';\nswitch({condition}) {{"
                output.append(result)
                stack.append(('switch', len(output)))
                return True
        return False
    
    def process_case_directive(self, line, stack, output):
        """Process @case directive"""
        case_pos = line.find('(')
        if case_pos != -1:
            case_content, end_pos = extract_balanced_parentheses(line, case_pos)
            if case_content is not None:
                condition = php_to_js(case_content.strip())
                result = f"\ncase {condition}:\n__switchOutputContent__ += `"
                output.append(result)
                stack.append(('case', len(output)))
                return True
        return False
    
    def process_default_directive(self, line, stack, output):
        """Process @default directive"""
        result = f"\ndefault:\n__switchOutputContent__ += `"
        output.append(result)
        stack.append(('default', len(output)))
        return True
    
    def process_break_directive(self, line, stack, output):
        """Process @break directive"""
        result = f"`;\nbreak;"
        output.append(result)
        return True
    
    def process_endswitch_directive(self, stack, output):
        """Process @endswitch directive"""
        if stack and stack[-1][0] in ['switch', 'case', 'default']:
            stack.pop()
            result = "`;\n}\nreturn __switchOutputContent__;\n})}"
            output.append(result)
            return True
        return False
