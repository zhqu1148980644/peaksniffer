# Peaksniffer
**Peaksniffer** is a webserve based on the two-step prediction model: **CharID**.
**Peaksniffer** contains two main functions, **Predict** and **Database**.
### * The *Predict* function 
Because the **CharID** model consists of two parts: the **CharID-Anchor model** and the **CharID-loop model**. So the ***Predict*** function also contains two functions, one is **Predict anchor candidates**, which corresponds to the **CharID-Anchor model** and determines which regions are anchors or non-anchors. The other is **Predict anchor pairs**, which corresponds to the **CharID-loop model**, and determines which regions as anchors can constituted loops.
### * The *Database* function 
The ***Database*** function also has two functions, **Query** and **Visualize**. Firstly the **Query** function stores a total of 308,974, 329,209 and 227,970 potential chromatin accessible region interactions for GM12878, K562 and Hela-S3 predict by **CharID**. Users can download these loops and also view the Hi-C heatmap, epigenomic signals and other Modifying signals of the regions corresponding to these loops. With the **Visualize** function, users can enter a regions, visualize the region, CharID predicted loops and the associated Hi-C heatmap, epigenomic signals and other Modifying signals.
