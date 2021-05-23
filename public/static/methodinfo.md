# Peaksniffer
**Peaksniffer**is a webserve based on the two-step prediction model: **CharID**.
**Peaksniffer** contains two main functions, one is **Predict**, and the other is **Database**.
* The *Predict* function
Because the **CharID** model consists of two parts: the **CharID-Anchor model** and the **CharID-loop model**.So the *Predict* function also contains two functions, one is **Predict anchor candidates**, which corresponds to the **CharID-Anchor model** and determines whether regions are anchors or non-anchors. The other is **Predict anchor pairs**, which corresponds to the **CharID-loop model**, and determines which regions as anchors can constituted loops.
