#!/usr/bin/env python3
"""Składa src/* i vendor/* w jeden plik docs/index.html (PWA). Uruchom: python3 build.py"""
import json, re, pathlib
ROOT=pathlib.Path(__file__).parent
src=ROOT/'src'; vendor=ROOT/'vendor'; docs=ROOT/'docs'
hj=json.dumps(json.load(open(src/'hershey.json',encoding='utf-8')),separators=(',',':')).replace('</','<\\/')
fj=(src/'fonts.json').read_text(encoding='utf-8').replace('</','<\\/')
ot=(vendor/'opentype.min.js').read_text(encoding='utf-8')
qr=(vendor/'qrcode.js').read_text(encoding='utf-8')
te=(src/'engine_text.js').read_text(encoding='utf-8')
ic=(src/'icons.js').read_text(encoding='utf-8')
dx=(src/'engine_dxf.js').read_text(encoding='utf-8')
dx=dx[:dx.index('/* ===================== Files')]
dx=dx.replace("const LAYER_COLORS={CUT:1, FRAME:3, TEXT:7, DEVICES:8, RAIL:9, CABINET:5, PLATE:6};\n","")
dx=dx.replace("2\\nLAYER\\n70\\n8\\n","2\\nLAYER\\n70\\n${Object.keys(LAYER_COLORS).length+1}\\n")
body=(src/'body.js').read_text(encoding='utf-8')
i=body.index('__DXF__'); body=body[:i]+dx+body[i+len('__DXF__'):]
s=(src/'shell.html').read_text(encoding='utf-8')
for k,v in [('__HERSHEY__',hj),('__FONTS__',fj),('__OPENTYPE__',ot),('__QR__',qr),('__ICONS__',ic),('__TEXTENGINE__',te),('__BODY__',body)]:
    i=s.index(k); s=s[:i]+v+s[i+len(k):]
docs.mkdir(exist_ok=True)
(docs/'index.html').write_text(s,encoding='utf-8')
ver=re.search(r"APP_VER='([^']+)'",s).group(1)
sw=docs/'sw.js'; sw.write_text(re.sub(r"const CACHE='[^']+'", f"const CACHE='eitlab-frontpanel-v{ver}'", sw.read_text(encoding='utf-8')),encoding='utf-8')
print('zbudowano docs/index.html', len(s), 'bajtów, wersja', ver)
