import re

with open('src/app/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines, 1):
    if '/' in line:
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
        print(f'Line {i}: {line.strip()[:80]}')