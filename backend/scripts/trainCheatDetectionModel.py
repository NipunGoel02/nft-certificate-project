import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Load dataset from CSV exported from database (you need to export cheatData collection)
# CSV columns: timeSpentPerQuestion (list), answerChangesPerQuestion (list), tabSwitchCount (int), label (0=not cheating, 1=cheating)

def preprocess_features(df):
    # Example feature engineering: average time, total answer changes, tab switch count
    df['avgTime'] = df['timeSpentPerQuestion'].apply(lambda x: np.mean(eval(x)) if pd.notnull(x) else 0)
    df['totalChanges'] = df['answerChangesPerQuestion'].apply(lambda x: np.sum(eval(x)) if pd.notnull(x) else 0)
    df['tabSwitchCount'] = df['tabSwitchCount'].fillna(0)
    return df[['avgTime', 'totalChanges', 'tabSwitchCount']]

def main():
    data_path = 'cheat_data.csv'  # Path to your exported dataset CSV
    df = pd.read_csv(data_path)

    X = preprocess_features(df)
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    print('Accuracy:', accuracy_score(y_test, y_pred))
    print('Classification Report:')
    print(classification_report(y_test, y_pred))

    # Save the trained model
    joblib.dump(clf, 'cheat_detection_model.pkl')
    print('Model saved as cheat_detection_model.pkl')

if __name__ == '__main__':
    main()
