import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score , mean_absolute_error

# load the processed dataset
df = pd.read_csv("dataset/processed_student_performance.csv")

 

# x y
x =df.drop(columns=["FinalGrade"])
y = df["FinalGrade"]

#   split data
x_train , x_test ,y_train , y_test  = train_test_split(
    x,y, test_size=0.2 , random_state=42
)

# linier regression

lr  =  LinearRegression () .fit (x_train,y_train)
lr_pred  = lr.predict(x_test)


# random forest

rf  =  RandomForestRegressor () .fit (x_train,y_train)
rf_pred  = rf.predict(x_test)

# print (lr_pred[:10])
# print (rf_pred[:10])

# evaluation

def evaluate_model(  model_name , y_predict , y_true ):
    mse = mean_squared_error(y_true, y_predict)
    r2 = r2_score(y_true, y_predict)
    mae = mean_absolute_error(y_true, y_predict)
    rmse = np.sqrt(mse)
    print(f"\n {model_name} performance")
    print(f"mean squared error: {mse:.3f}")
    print(f"R-squared: {r2:.0f}")
    print(f"mean absolute error: {mae:.0f}")
    print(f"root mean squared error: {rmse:.0f}")
evaluate_model("Linear Regression", lr_pred, y_test)    
evaluate_model("Random Forest", rf_pred, y_test)  


# save the models
joblib.dump(lr, "models/lr_model.joblib")
joblib.dump(rf, "models/rf_model.joblib")
print("\n saved models! -> models/lr_model.joblib , models/rf_model.joblib")



# sanity check
print("\n === sanity check === ")
print("actual values: ", y_test.values[:10])
print("linear regression predictions: ", lr_pred[:10])
print("random forest predictions: ", rf_pred[:10])









