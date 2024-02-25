import sys
import json
import tensorflow as tf

# Read input from command-line arguments or stdin
json_input = sys.stdin.read()
rowdata = json.loads(json_input)
# Process the data using your model


loaded_model = tf.keras.models.load_model('D:/GP/Real GP/GP-BackEnd/machine/train.model')
# Convert the result object to JSON
def fun(x1,x2):
    input_data = [x1,x2]
    predictions = loaded_model.predict([input_data])
    data = predictions.tolist()
    value = max(data)
    pos = value.index(max(value))
    return pos
    
position = fun(rowdata['key1'],rowdata['key2'])
if position == 0:
        print('left') 
elif position == 1:
        print('hold')
else:
        print('right')



# Print the JSON output
# result = {
#     "key": "value",
#     "foo": "bar"
# }

# Convert the result object to JSON
# json_output = json.dumps(result)

# Print the JSON output
# print(json_output)



# Print the result to stdout
# print(result)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
