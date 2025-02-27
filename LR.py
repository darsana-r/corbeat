import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


dataset=pd.read_csv('heart.csv')
#dataset.head()

dataset['target'].value_counts()
X=dataset.drop(columns='target',axis=1)
Y=dataset['target']

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, stratify=Y, random_state=2)

#LOGISTIC REGRESSION
#===============================
model = LogisticRegression()
model.fit(X_train, Y_train)

X_train_prediction = model.predict(X_train)
training_data_accuracy = accuracy_score(X_train_prediction, Y_train)

#print('Accuracy on Training data : ', training_data_accuracy)

# accuracy on test data
X_test_prediction = model.predict(X_test)
test_data_accuracy = accuracy_score(X_test_prediction, Y_test)

#print('Accuracy on Test data : ', test_data_accuracy)
#---------------------------------------------------------------------------------------------
input_data = (56,1,3,130,256,1,2,142,1,0.6,2)

# change the input data to a numpy array
input_data_as_numpy_array= np.asarray(input_data)

# reshape the numpy array as we are predicting for only on instance
input_data_reshaped = input_data_as_numpy_array.reshape(1,-1)

prediction = model.predict(input_data_reshaped)
print(prediction)

if (prediction[0]== 0):
  print('You DOES NOT HAVE Heart Disease!')
else:
  print('You HAVE Heart Disease!')
