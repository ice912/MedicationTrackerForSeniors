import os
import re

file_path = r'c:\Users\admin\Desktop\stitch\medication_dashboard_1\medication_dashboard_1_code.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# CSS Variables
content = re.sub(
    r':root\s*\{[^}]*\}',
    ':root {\n      --bg-theme: #F4F9F4;\n      --card-bg: #FFFFFF;\n      --accent-main: #2563EB;\n      --status-taken: #16A34A;\n      --status-pending: #3B82F6;\n      --text-main: #1E293B;\n    }',
    content
)
content = content.replace('var(--bg-warm)', 'var(--bg-theme)')

# Colors replacements
content = content.replace('bg-orange-100', 'bg-blue-100')
content = content.replace('text-orange-600', 'text-blue-600')

content = content.replace('bg-yellow-100', 'bg-green-100')
content = content.replace('text-yellow-600', 'text-green-600')

content = content.replace('bg-indigo-100', 'bg-cyan-100')
content = content.replace('text-indigo-600', 'text-cyan-600')

content = content.replace('text-yellow-500', 'text-blue-500')
content = content.replace('text-yellow-700', 'text-blue-700')

content = content.replace('bg-orange-500', 'bg-blue-500')
content = content.replace('hover:bg-orange-600', 'hover:bg-blue-600')
content = content.replace('border-orange-700', 'border-blue-700')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
