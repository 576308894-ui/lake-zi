import re

with open('src/app/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
in_template = False
template_start_line = 0

for i, line in enumerate(lines, 1):
    # Check for template literal start/end
    template_count = line.count('`')
    if template_count % 2 == 1:
        in_template = not in_template
        if in_template:
            template_start_line = i
        else:
            template_start_line = 0
    
    # Check for regex literals (lines that end with / but not in string/comments)
    if '/' in line and not in_template:
        # Skip comments, strings, HTML tags, etc.
        if '//' in line:
            continue
        if '/*' in line:
            continue
        if '"' in line:
            continue
        if "'" in line:
            continue
        if '</' in line:
            continue
        if './' in line:
            continue
        if '../' in line:
            continue
        if 'http' in line:
            continue
        if 'https' in line:
            continue
        
        # Check if line ends with /
        if line.strip().endswith('/'):
            print(f'Potential regex issue on line {i}: {line.strip()[:50]}')

if in_template:
    print(f'Unclosed template literal starting at line {template_start_line}')