# 1.The *Predict* function
## (1) Predict anchor candidates
- #### Users can enter any bed file of interest and paste it into the box at the bottom.Example The BED file is shown below: 
```
chr1:91363-91505
chr1:783055-783158
chr1:785655-785805
```
- #### When you have finished pasting, click the **ADD CHROMRANGES** button.
- #### Clicking on the **Predict** button will input all the regions into the CharID-Anchor model for prediction, and finally the probability value of whether these regions are loop anchor in the three cell lines will be obtained.
## (2) Predict anchor pairs
- #### Click the next or predict anchor pairs button to proceed to the CharID-Loop model's prediction page.Similarly, paste in the box below the region pairs predicted as anchor in the Predict anchor candidates step or the region pairs you want the user to predict.Example The PAIRS file is shown below:
```
chr1:91363-91505    chr1:785655-785805
```
- #### When you have finished pasting, click the **ADD CHROMRANGES** button.
- #### Clicking on the **Predict** button will input all the regions into the CharID-Loop model for prediction, and finally the probability value of whether these region-pairs are loop in the three cell lines will be obtained.
# 2.The *Database* function 
## (1)Query
- #### This page shows information on the loops predicted by the CharID model for the three cell lines, containing the location of each loop and the predicted probability value.
- #### The user can filter and  searching these loops by entering the region of interest in the middle data box.
- #### Users can click on the images on the **info** column and can visualize chromatin features around given chromosome region pairs.
## (2)Visualize
- #### On this page, the user can enter any region of interest for the three cell lines and view the CharID predicted loops for that region, the loops for the experiment, some modification signals, and Hi-C heatmap information.Example is shown below:
```
GM12878 chr1:1055625-1055748    chr1:1180618-1180853
```
## (3)Download
- #### Users can choose to download the OCRs-mediated loops of the three cell lines contained in the Database. By default, all loops of the three cell lines are downloaded, and it is recommended that you specify a single cell line for downloading, so that the download speed is faster.
