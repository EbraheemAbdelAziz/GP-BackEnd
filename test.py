import sys
import json
import tensorflow as tf

json_input = sys.stdin.read()
rowdata = json.loads(json_input)
 print(rowdata['key1'])