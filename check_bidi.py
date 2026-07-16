import re

with open('src/app/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Check for bidirectional control characters
bidi_chars = [
    '\u200E', '\u200F', '\u202A', '\u202B', '\u202C', 
    '\u202D', '\u202E', '\u2066', '\u2067', '\u2068', '\u2069'
]

for i, line in enumerate(content.split('\n'), 1):
    for char in bidi_chars:
        if char in line:
            print(f'Line {i} contains bidirectional char {repr(char)}')

# Check for zero-width characters
zero_width = ['\u200B', '\u200C', '\u200D', '\uFEFF']
for i, line in enumerate(content.split('\n'), 1):
    for char in zero_width:
        if char in line:
            print(f'Line {i} contains zero-width char {repr(char)}')

# Check for other suspicious characters
suspicious = ['\u00AD', '\u2028', '\u2029']
for i, line in enumerate(content.split('\n'), 1):
    for char in suspicious:
        if char in line:
            print(f'Line {i} contains suspicious char {repr(char)}')