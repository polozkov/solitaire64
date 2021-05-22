import os

my_files = os.listdir(os.getcwd())
my_files.sort()

content_union_js = ""
for i_name in my_files:
    if (i_name[-3:] == ".js"):
        #print(i_name)
        content_union_js += "\n" + open(i_name).read() + "\n"

content_index_htmp = open("index.html").read()
cutting_index = content_index_htmp.find("<script src=")
cutted_html = content_index_htmp[0:cutting_index]

script_open = '<script type="text/javascript">'
script_close = '</script>' +'\n' + '</body>' + '\n' + '</html>'

final_html_content = cutted_html + script_open + content_union_js + script_close
f = open('Solitaire_64_puzzle.html', 'w')
f.write(final_html_content)
f.close()
