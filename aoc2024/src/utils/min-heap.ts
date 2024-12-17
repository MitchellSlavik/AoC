export const MinHeap = {
  siftDown<V>(heap: [number, V][], i = 0, [key, value] = heap[i]) {
    if (i < heap.length) {
      while (1) {
        let j = i * 2 + 1;
        if (j + 1 < heap.length && heap[j][0] > heap[j + 1][0]) j++;
        if (j >= heap.length || key <= heap[j][0]) break;
        heap[i] = heap[j];
        i = j;
      }
      heap[i] = [key, value];
    }
  },
  heapify<V>(heap: [number, V][]) {
    for (let i = heap.length >> 1; i--; ) this.siftDown(heap, i);
    return heap;
  },
  pop<V>(heap: [number, V][]) {
    return this.exchange(heap, heap.pop());
  },
  exchange<V>(heap: [number, V][], value) {
    if (!heap.length) return value;
    let w = heap[0];
    this.siftDown(heap, 0, value);
    return w;
  },
  push<V>(heap: [number, V][], [key, value]) {
    let i = heap.length;
    let j = (i - 1) >> 1;
    while (j >= 0 && key < heap[j][0]) {
      heap[i] = heap[j];
      i = j;
      j = (i - 1) >> 1;
    }
    heap[i] = [key, value];
    return heap;
  },
};
