# import library
import pandas as pd
from datetime import datetime
import seaborn as sns
import io
import os
import numpy as np

# import dataset
os.chdir('/Users/weichen/Documents/Upenn/CIS 550/Project/DATASET/UNSC')
os.getcwd()

speeches = pd.read_csv('meta_speeches.csv')
speeches['speech_date'] = speeches['speech_date'].apply(lambda x: datetime.strptime(x, '%d-%b-%y').date())
# add speakers' gender
#  to define gender: use prefix: male: Mr/Sir  female: Mrs/Ms/Miss
speeches['gender'] = speeches['speaker'].apply(lambda x:
        1 if (x.startswith('Mr ') or x.startswith('Mr.') or x.startswith('Sir ') or x.startswith('Sir.'))
        else 0 if (x.startswith('Mrs ') or x.startswith('Mrs.') or x.startswith('Ms ') or x.startswith('Ms.')
                   or x.startswith('Miss ') or x.startswith('Miss.'))
        else np.NaN).astype('Int64')

speeches.to_csv('speeches_new2.csv', date_format='%Y-%m-%d')

# speeches.topic.nunique()

speeches['topic_keyword'] = speeches['topic'].apply(lambda x:
                                'Women/Children' if 'women' in x.lower()
                                else 'Children' if ('women' or 'child' or 'youth') in x.lower()
                                else 'Security' if 'security' in x.lower()
                                else 'Climate' if 'climate' in x.lower()
                                else 'Health' if ('aids' or 'hiv') in x.lower()
                                else 'Conflict' if 'conflict' in x.lower()
                                else 'Peace' if 'peace' in x.lower()
                                else 'Middle East' if 'middle east' in x.lower()
                                else 'Africa' if 'africa' in x.lower()
                                else 'Refugees' if 'refugees' in x.lower()
                                else 'Others')


speeches.to_csv('speeches_new2.csv', date_format='%Y-%m-%d')



