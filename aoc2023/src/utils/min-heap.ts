export const MinHeap = {
  siftDown(heap, i = 0, [key, ...rest] = heap[i]) {
    if (i < heap.length) {
      while (1) {
        let j = i * 2 + 1;
        if (j + 1 < heap.length && heap[j][0] > heap[j + 1][0]) j++;
        if (j >= heap.length || key <= heap[j][0]) break;
        heap[i] = heap[j];
        i = j;
      }
      heap[i] = [key, ...rest];
    }
  },
  heapify(heap) {
    for (let i = heap.length >> 1; i--; ) this.siftDown(heap, i);
    return heap;
  },
  pop(heap) {
    return this.exchange(heap, heap.pop());
  },
  exchange(h, v) {
    if (!h.length) return v;
    let w = h[0];
    this.siftDown(h, 0, v);
    return w;
  },
  push(heap, [key, ...rest]) {
    let i = heap.length;
    let j = (i - 1) >> 1;
    while (j >= 0 && key < heap[j][0]) {
      heap[i] = heap[j];
      i = j;
      j = (i - 1) >> 1;
    }
    heap[i] = [key, ...rest];
    return heap;
  },
};
