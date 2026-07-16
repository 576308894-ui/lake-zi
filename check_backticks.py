with open('src/app/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

backtick_count = content.count('`')
print(f'Total backticks: {backtick_count}')
print(f'Is even: {backtick_count % 2 == 0}')

# Check each line
lines = content.split('\n')
count = 0
for i, line in enumerate(lines, 1):
    line_count = line.count('`')
    count += line_count
    if line_count > 0:
        print(f'Line {i}: {line_count} backticks (total: {count})')