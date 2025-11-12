"""
Helper để detect HTML tags có @subscribe/@watch directives
"""

import re

def find_tags_with_subscribe(html_content):
    """
    Tìm tất cả HTML tags có @subscribe/@watch trong attributes
    
    Returns: List of dict với structure:
    {
        'tag': 'div',
        'full_tag': '<div ... @subscribe(...) ...>',
        'directive': '@subscribe($userState)',
        'is_self_closing': False,
        'start_pos': 0,
        'end_pos': 50
    }
    """
    results = []
    
    # Pattern để match HTML opening tags (bao gồm self-closing)
    # Capture: tag name, full attributes, self-closing indicator
    tag_pattern = r'<(\w+)([^>]*?)(/?)>'
    
    for match in re.finditer(tag_pattern, html_content):
        tag_name = match.group(1)
        attributes = match.group(2)
        is_self_closing = match.group(3) == '/'
        
        # Check xem attributes có chứa @subscribe hoặc @watch không
        if re.search(r'@(?:subscribe|watch)\s*\(', attributes, re.IGNORECASE):
            # Tìm directive cụ thể
            directive_match = re.search(r'@(?:subscribe|watch)\s*\([^)]*\)', attributes, re.IGNORECASE)
            if directive_match:
                results.append({
                    'tag': tag_name,
                    'full_tag': match.group(0),
                    'attributes': attributes,
                    'directive': directive_match.group(0),
                    'is_self_closing': is_self_closing,
                    'start_pos': match.start(),
                    'end_pos': match.end()
                })
    
    return results


def extract_subscribe_content(html_content):
    """
    Extract content của thẻ có @subscribe
    Cho cả regular tags và self-closing tags
    """
    tags_with_subscribe = find_tags_with_subscribe(html_content)
    results = []
    
    for tag_info in tags_with_subscribe:
        if tag_info['is_self_closing']:
            # Self-closing tag: <input @subscribe(...) />
            results.append({
                **tag_info,
                'content': None,  # Self-closing không có content
                'closing_tag_pos': None
            })
        else:
            # Regular tag: <div @subscribe(...)>content</div>
            # Tìm closing tag tương ứng
            tag_name = tag_info['tag']
            start_pos = tag_info['end_pos']
            
            # Pattern tìm closing tag
            closing_pattern = rf'</{tag_name}\s*>'
            closing_match = re.search(closing_pattern, html_content[start_pos:], re.IGNORECASE)
            
            if closing_match:
                content = html_content[start_pos:start_pos + closing_match.start()]
                results.append({
                    **tag_info,
                    'content': content,
                    'closing_tag_pos': start_pos + closing_match.end()
                })
            else:
                # Không tìm thấy closing tag (có thể là malformed HTML)
                results.append({
                    **tag_info,
                    'content': None,
                    'closing_tag_pos': None
                })
    
    return results


# Test cases
if __name__ == '__main__':
    test_html = '''
    <div class="container" @subscribe($userState)>
        <h1>Hello</h1>
        <input type="text" @subscribe($inputValue) />
        <img src="test.jpg" @subscribe($imageState) >
    </div>
    <span @watch($counterState)>Count</span>
    '''
    
    print("=== Test: Find tags with @subscribe ===\n")
    tags = find_tags_with_subscribe(test_html)
    
    for i, tag in enumerate(tags, 1):
        print(f"{i}. Tag: <{tag['tag']}>")
        print(f"   Directive: {tag['directive']}")
        print(f"   Self-closing: {tag['is_self_closing']}")
        print(f"   Full tag: {tag['full_tag']}")
        print()
    
    print("\n=== Test: Extract content ===\n")
    contents = extract_subscribe_content(test_html)
    
    for i, item in enumerate(contents, 1):
        print(f"{i}. Tag: <{item['tag']}>")
        print(f"   Directive: {item['directive']}")
        if item['content'] is not None:
            print(f"   Content: {item['content'][:50]}..." if len(item['content']) > 50 else f"   Content: {item['content']}")
        else:
            print(f"   Content: (self-closing)")
        print()

