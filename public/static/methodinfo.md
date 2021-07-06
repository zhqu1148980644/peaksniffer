# Peaksniffer


#### **Peaksniffer** is a website based on the two-step prediction model: **CharID**.
#### **Peaksniffer** contains two main functionalities: **Predict** and **Database**.For details on how to use the website, click on the Usage page.

## The *Predict* function 
#### Because the **CharID** model consists of two parts: the **CharID-Anchor model** and the **CharID-loop model**. So the ***Predict*** function also contains two functions, one is **Predict anchor candidates**, which corresponds to the **CharID-Anchor model** and determines which regions are anchors or non-anchors. The other is **Predict anchor pairs**, which corresponds to the **CharID-loop model**, and determines which regions as anchors can constituted loops.

## The *Database* function 
#### The ***Database*** function also has two functions, **Query** and **Visualize**. Firstly the **Query** function stores a total of 308,974, 329,209 and 227,970 potential OCR-mediated loops for GM12878, K562 and Hela-S3 predict by **CharID**. Users can download these loops and also view the chromatin features around predicted OCR-mediated loops. With the **Visualize** function, users can enter a regions, visualize chromatin features around the region.

### Resources
[CharID](https://github.com/Yin-Shen/CharID) \
[Peaksniffer](https://github.com/zhqu1148980644/peaksniffer)
