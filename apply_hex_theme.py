import os

file_path = r'c:\Users\admin\Desktop\stitch\medication_dashboard_1\medication_dashboard_1_code.html'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace CSS Variables
css_vars = """    :root {
      --bg-theme: #FFDBFD;
      --card-bg: #FFFFFF;
      --accent-main: #6367FF;
      --status-taken: #6367FF;
      --status-pending: #8494FF;
      --text-main: #2C3E50;
    }"""
text = text.replace(
    '''    :root {
      --bg-warm: #FFFBF5;
      --card-bg: #FFFFFF;
      --accent-warm: #E67E22; /* Orange for visibility */
      --status-taken: #27AE60;
      --status-pending: #F1C40F;
      --text-main: #2C3E50;
    }''', css_vars)

text = text.replace('var(--bg-warm)', 'var(--bg-theme)')

# Tailwnid arbitrary values mappings
# Morning (orange)
text = text.replace('bg-orange-100', 'bg-[#C9BEFF]')
text = text.replace('text-orange-600', 'text-[#6367FF]')

# Afternoon (yellow)
text = text.replace('bg-yellow-100', 'bg-[#FFDBFD]')
text = text.replace('text-yellow-600', 'text-[#8494FF]')
text = text.replace('text-yellow-500', 'text-[#8494FF]')
text = text.replace('text-yellow-700', 'text-[#6367FF]')

# Evening (indigo)
text = text.replace('bg-indigo-100', 'bg-[#C9BEFF]')
text = text.replace('text-indigo-600', 'text-[#6367FF]')

# Status Taken (green)
text = text.replace('text-green-600', 'text-[#6367FF]')
text = text.replace('text-green-700', 'text-[#6367FF]')

# Buttons
text = text.replace('bg-orange-500', 'bg-[#6367FF]')
text = text.replace('hover:bg-orange-600', 'hover:bg-[#8494FF]')
text = text.replace('border-orange-700', 'border-[#6367FF]')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Theme applied successfully.")
