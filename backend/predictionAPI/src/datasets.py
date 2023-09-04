from datasets import concatenate_datasets,load_dataset,Dataset

def load_combined_datasets():
    dataset4=load_dataset("SetFit/emotion")
    dataset2=load_dataset("mteb/emotion")
    dataset5=load_dataset("dair-ai/emotion")
    dataset6=load_dataset("ttxy/emotion")
    dataset7=load_dataset("philschmid/emotion")

    # Adding dataset4 with 2
    combined_train = concatenate_datasets([dataset4['train'], dataset2['train']])
    combined_validation = concatenate_datasets([dataset4['validation'], dataset2['validation']])
    combined_test = concatenate_datasets([dataset4['test'], dataset2['test']])

    dataset1 = {"train": combined_train, "validation": combined_validation, "test": combined_test}


    combined_train = concatenate_datasets([dataset5['train'], dataset6['train'], dataset7['train']])
    combined_validation = concatenate_datasets([dataset5['validation'], dataset6['validation'], dataset7['validation']])
    combined_test = concatenate_datasets([dataset5['test'], dataset6['test'], dataset7['test']])

    # Create a new DatasetDict with the combined splits
    dataset3 = {"train": combined_train, "validation": combined_validation, "test": combined_test}

    combined_train = concatenate_datasets([dataset5['train'], dataset6['train'], dataset7['train']])
    combined_validation = concatenate_datasets([dataset5['validation'], dataset6['validation'], dataset7['validation']])
    combined_test = concatenate_datasets([dataset5['test'], dataset6['test'], dataset7['test']])
 
    # Create a new DatasetDict with the combined splits
    dataset3 = {"train": combined_train, "validation": combined_validation, "test": combined_test}

    # Rename the 'label' column to 'label_text' in dataset3
    dataset3_train = dataset3['train'].rename_column('label', 'label_text')
    dataset3_validation = dataset3['validation'].rename_column('label', 'label_text')
    dataset3_test = dataset3['test'].rename_column('label', 'label_text')

    # Extract the label_text feature from dataset3
    label1 = dataset3_train['label_text']
    label2 = dataset3_validation['label_text']
    label3 = dataset3_test['label_text']

    # Define label mapping
    label_mapping = {
        0: "sadness",
        1: "joy",
        2: "love",
        3: "anger",
        4: "fear",
        5: "surprise"
    }
    label_text1 = list(map(lambda x: label_mapping[x], label1))
    label_text2 = list(map(lambda x: label_mapping[x], label2))
    label_text3 = list(map(lambda x: label_mapping[x], label3))
    dataset3_train['label_text'][:len(label_text1)] = label_text1

    newdataset3_train=Dataset.from_dict({'text':dataset3_train['text'],"label_text": label_text1})
    newdataset3_validation=Dataset.from_dict({'text':dataset3_validation['text'],"label_text": label_text2})
    newdataset3_test=Dataset.from_dict({'text':dataset3_test['text'],"label_text": label_text3})

    # Convert the label_text feature in dataset1 to string type
    dataset1_train = dataset1['train'].map(lambda example: {'label_text': str(example['label_text'])})
    dataset1_validation = dataset1['validation'].map(lambda example: {'label_text': str(example['label_text'])})
    dataset1_test = dataset1['test'].map(lambda example: {'label_text': str(example['label_text'])})

    dataset1_train = dataset1_train.remove_columns('label')
    dataset1_validation = dataset1_validation.remove_columns('label')
    dataset1_test = dataset1_test.remove_columns('label')

    # Concatenate the datasets
    combined_train = concatenate_datasets([dataset1_train, newdataset3_train])
    combined_validation = concatenate_datasets([dataset1_validation, newdataset3_validation])
    combined_test = concatenate_datasets([dataset1_test, newdataset3_test])

    # Create the combined dataset dictionary
    dataset = {"train": combined_train, "validation": combined_validation, "test": combined_test}
    return dataset