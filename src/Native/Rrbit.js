/* global F2, F3 */
function Vector(len) {
	this.length = len || 0;
	this.root = null;
	this.pre = null;
	this.aft = null;
}
function CancelToken(value, index) {
	this.value = value;
	this.index = index;
}
CancelToken.prototype = Object.create(Error.prototype);
CancelToken.prototype.message = "not a real error";
CancelToken.prototype.name = "CancelToken";
CancelToken.prototype.constructor = CancelToken;
CancelToken.prototype.isCancelToken = true;

var Cassowry = {
	OCCULANCE_ENABLE: true,
	Vector: Vector,
	factory: function factory() {
		return new this.Vector();
	},
	clone: function clone(list) {
		var vec = this.factory();
		vec.length = list.length;
		vec.root = list.root;
		vec.pre = list.pre;
		vec.aft = list.aft;
		if (list.originOffset) vec.originOffset = list.originOffset;
		return vec;
	},
	IllegalRange: function IllegalRange(msg) {
		throw new RangeError(msg || 'out of range');
	},
	CancelToken: CancelToken,
	NotFound: new CancelToken(null, -1),
	cancel: function cancel(value, index) {
		throw new CancelToken(value, index);
	},
	SinglyLinkedList: function SinglyLinkedList(data, len, next) {
		this.data = data;
		this.link = next;
		this.length = len;
	},
	addLL: function addLL(value, list) {
		if (list) {
			return new this.SinglyLinkedList(value, list.length + 1, list);
		}
		return new this.SinglyLinkedList(value, 1, list);
	},
	llToArray: function llToArray(ll) {
		if (!ll) return new Array(0);
		var result = new Array(ll.length);
		var i = 0;
		while (ll) {
			result[i] = ll.data;
			ll = ll.link;
			i += 1;
		}
		return result;
	},
	arrayToLL: function arrayToLL(arr) {
		var list = null;
		for (var i = arr.length - 1; i >= 0; i--) {
			list = this.addLL(arr[i], list);
		}
		return list;
	},
	aPush: function aPush(value, arr) {
		var len = arr.length;
		var result = new Array(len + 1);
		for (var i = 0; i < len; i++) {
			result[i] = arr[i];
		}
		result[len] = value;
		return result;
	},
	aUnshift: function aUnshift(value, arr) {
		var len = arr.length;
		var result = new Array(len + 1);
		for (var i = 0; i < len; i++) {
			result[i + 1] = arr[i];
		}
		result[0] = value;
		return result;
	},
	aSet: function aSet(index, value, arr) {
		var len = arr.length;
		var result = new Array(len);
		for (var i = 0; i < len; i++) {
			result[i] = arr[i];
		}
		result[index] = value;
		return result;
	},
	aSetUnsafe: function aSet(index, value, arr) {
		arr[index] = value;
		return arr;
	},
	aSetAsLast: function aSetAsLast(index, value, src) {
		if (!src) return [value];
		var result = this.aSlice(0, index, src);
		result[index] = value;
		return result;
	},
	aSlice: function aSlice(from, to, arr) {
		var len = to - from;
		var result = new Array(len);
		for (var i = 0; len > i; i++) {
			result[i] = arr[i + from];
		}
		return result;
	},
	aInit: function aInit(fn, from, to) {
		var len = to - from
		var list = new Array(len);
		for (var i = 0; len > i; i++) {
			list[i] = fn(from + i);
		}
		return list
	},
	tailOffset: function tailOffset(length) {
		return length >>> 5 << 5;
	},
	tailIndex: function tailIndex(index) {
		return index & 31;
	},
	indexInBlockAtDepth: function indexInBlockAtDepth(index, depth) {
		return index >>> depth * 5 & 31;
	},
	depthFromLength: function depthFromLength(len) {
		if (len <= 1024) return 1;
		if (len <= 32768) return 2;
		if (len <= 1048576) return 3;
		if (len <= 33554432) return 4;
		if (len <= 1073741824) return 5;
		return 6;
	},
	DEPTHS: [32, 1024, 32768, 1048576, 33554432, 1073741824],
	appendLeafOntoTree: function appendLeafOntoTree(leaf, tree, i) {
		var d1, d2, d3, d4, d5, n1, n2, n3, n4, n5;
		if (!tree) {
			return [leaf];
		}
		if (i < 1024) {
			return this.aSetAsLast(i >>> 5 & 31, leaf, tree);
		}
		if (i < 32768) {
			if (i == 1024) {
				tree = [tree];
			}
			d2 = tree;
			d1 = d2[i >>> 10 & 31];
			n1 = this.aSetAsLast(i >>> 5 & 31, leaf, d1);
			n2 = this.aSetAsLast(i >>> 10 & 31, n1, d2);
			return n2;
		}
		if (i < 1048576) {
			if (i == 32768) {
				tree = [tree];
			}
			d3 = tree;
			d2 = d3[i >>> 15 & 31];
			d1 = d2 && d2[i >>> 10 & 31];
			n1 = this.aSetAsLast(i >>> 5 & 31, leaf, d1);
			n2 = this.aSetAsLast(i >>> 10 & 31, n1, d2);
			n3 = this.aSetAsLast(i >>> 15 & 31, n2, d3);
			return n3;
		}
		if (i < 33554432) {
			if (i == 1048576) {
				tree = [tree];
			}
			d4 = tree;
			d3 = d4[i >>> 20 & 31];
			d2 = d3 && d3[i >>> 15 & 31];
			d1 = d2 && d2[i >>> 10 & 31];
			n1 = this.aSetAsLast(i >>> 5 & 31, leaf, d1);
			n2 = this.aSetAsLast(i >>> 10 & 31, n1, d2);
			n3 = this.aSetAsLast(i >>> 15 & 31, n2, d3);
			n4 = this.aSetAsLast(i >>> 20 & 31, n2, d4);
			return n4;
		}
		if (i < 1073741824) {
			if (i == 33554432) {
				tree = [tree];
			}
			d5 = tree;
			d4 = d5[i >>> 20 & 31];
			d3 = d4 && d4[i >>> 20 & 31];
			d2 = d3 && d3[i >>> 15 & 31];
			d1 = d2 && d2[i >>> 10 & 31];
			n1 = this.aSetAsLast(i >>> 5 & 31, leaf, d1);
			n2 = this.aSetAsLast(i >>> 10 & 31, n1, d2);
			n3 = this.aSetAsLast(i >>> 15 & 31, n2, d3);
			n4 = this.aSetAsLast(i >>> 20 & 31, n2, d4);
			n5 = this.aSetAsLast(i >>> 25 & 31, n2, d5);
			return n5;
		}
	},
	appendLeafOntoTreeUnsafe: function appendLeafOntoTree(leaf, tree, i) {
		var d1, d2, d3, d4, d5;
		if (!tree) {
			return [leaf];
		}
		if (i < 1024) {
			tree[i >>> 5 & 31] = leaf;
			return tree;
		}
		if (i < 32768) {
			if (i == 1024) {
				tree = [tree];
			}
			d1 = tree[i >>> 10 & 31] || (tree[i >>> 10 & 31] = []);
			d1[i >>> 5 & 31] = leaf;
			return tree;
		}
		if (i < 1048576) {
			if (i == 32768) {
				tree = [tree];
			}
			d3 = tree;
			d2 = d3[i >>> 15 & 31] || (d3[i >>> 15 & 31] = []);
			d1 = d2[i >>> 10 & 31] || (d2[i >>> 10 & 31] = []);
			d1[i >>> 5 & 31] = leaf;
			return tree;
		}
		if (i < 33554432) {
			if (i == 1048576) {
				tree = [tree];
			}
			d4 = tree;
			d3 = d4[i >>> 20 & 31] || (d4[i >>> 20 & 31] = []);
			d2 = d3[i >>> 15 & 31] || (d3[i >>> 15 & 31] = []);
			d1 = d2[i >>> 10 & 31] || (d2[i >>> 10 & 31] = []);
			d1[i >>> 5 & 31] = leaf;
			return tree;
		}
		if (i < 1073741824) {
			if (i == 33554432) {
				tree = [tree];
			}
			d5 = tree;
			d4 = d5[i >>> 25 & 31] || (d5[i >>> 25 & 31] = []);
			d3 = d4[i >>> 20 & 31] || (d4[i >>> 20 & 31] = []);
			d2 = d3[i >>> 15 & 31] || (d3[i >>> 15 & 31] = []);
			d1 = d2[i >>> 10 & 31] || (d2[i >>> 10 & 31] = []);
			d1[i >>> 5 & 31] = leaf;
			return tree;
		}
	},
	prependLeafOntoTree: function prependLeafOntoTree(leaf, list, treeLen) {
		var d1,
			d2,
			d3,
			d4,
			n1,
			n2,
			n3,
			n4,
			tree = list.root,
			offset = list.originOffset;
		if (!tree || treeLen == 0) {
			return [leaf];
		}
		if (treeLen <= 1024) {
			if (list.originOffset) {
			}
			if (treeLen == 1024) {
				list.originOffset = 1024 - 32;
				return [this.aSetUnsafe(31, leaf, new Array(32)), tree];
			}
			return this.aUnshift(leaf, tree);
		}
		if (treeLen <= 32768) {
			if (treeLen == 32768) {
				if (offset) {
					this.IllegalRange('error in drop(), failed to construct index correctly. please file a bug report');
				}
				list.originOffset = 32768 - 32;
				n1 = this.aSetUnsafe(31, leaf, new Array(32));
				n2 = this.aSetUnsafe(31, n1, new Array(32));
				return [n2, tree];
			}
			if (!offset) {
				list.originOffset = 1024 - 32;
				d1 = this.aSetUnsafe(31, leaf, new Array(32));
				return this.aUnshift(d1, tree);
			} else {
				list.originOffset = offset - 32;
				d1 = tree[0];
				n1 = this.aSet(offset - 32 >> 5 & 31, leaf, d1);
				n2 = this.aSet(0, n1, tree);
				return n2;
			}
		}
		if (treeLen <= 1048576) {
			if (treeLen == 1048576) {
				if (offset) {
					this.IllegalRange('error in drop(), failed to construct index correctly. please file a bug report');
				}
				list.originOffset = 1048576 - 32;
				n1 = this.aSetUnsafe(31, leaf, new Array(32));
				n2 = this.aSetUnsafe(31, n1, new Array(32));
				n3 = this.aSetUnsafe(31, n2, new Array(32));
				return [n3, tree];
			}
			if (!offset) {
				list.originOffset = 32768 - 32;
				n1 = this.aSetUnsafe(31, leaf, new Array(32));
				n2 = this.aSetUnsafe(31, n1, new Array(32));
				return this.aUnshift(n2, tree);
			} else {
				list.originOffset = offset - 32;
				d2 = tree[0];
				d1 = d2[offset - 32 >> 10];
				n1 = this.aSet(offset - 32 >> 5 & 31, leaf, d1 || new Array(32));
				n2 = this.aSet(offset - 32 >> 10 & 31, n1, d2);
				n3 = this.aSet(0, n2, tree);
				return n3;
			}
		}
		this.IllegalRange("can't prepend more than 1048576...yet :(");
	},
	trimTail: function trimTail(root, depth, len) {
		switch (depth) {
			case 5:
				return root[len >> 25 & 31][len >> 20 & 31][len >> 15 & 31][len >> 10 & 31][len >> 5 & 31];
			case 4:
				return root[len >> 20 & 31][len >> 15 & 31][len >> 10 & 31][len >> 5 & 31];
			case 3:
				return root[len >> 15 & 31][len >> 10 & 31][len >> 5 & 31];
			case 2:
				return root[len >> 10 & 31][len >> 5 & 31];
			case 1:
				return root[len >> 5 & 31];
		}
		return null;
	},
	trimTreeHeight: function trimTreeHeight(tree, depth, len) {
		var newDepth = this.depthFromLength(len);
		switch (depth - newDepth) {
			case 4:
				return tree[0][0][0][0];
			case 3:
				return tree[0][0][0];
			case 2:
				return tree[0][0];
			case 1:
				return tree[0];
			case 0:
				return tree;
		}
	},
	trimTree: function trimTree(tree, depth, len) {
		var newDepth = this.depthFromLength(len),
			d1,
			d2,
			d3,
			d4,
			d5;
		switch (depth) {
			case 5:
				d5 = tree;
				d4 = d5[len >> 25 & 31];
				d3 = d4[len >> 20 & 31];
				d2 = d3[len >> 15 & 31];
				d1 = d2[len >> 10 & 31];
				break;
			case 4:
				d4 = tree;
				d3 = d4[len >> 20 & 31];
				d2 = d3[len >> 15 & 31];
				d1 = d2[len >> 10 & 31];
				break;
			case 3:
				d3 = tree;
				d2 = d3[len >> 15 & 31];
				d1 = d2[len >> 10 & 31];
				break;
			case 2:
				d2 = tree;
				d1 = d2[len >> 10 & 31];
				break;
			case 1:
				d1 = tree;
				break;
		}
		switch (newDepth) {
			case 5:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				d2 = this.aSetUnsafe(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
				d3 = this.aSetUnsafe(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
				d4 = this.aSetUnsafe(len >> 20 & 31, d3, this.aSlice(0, len >> 20 & 31, d4));
				d5 = this.aSetUnsafe(len >> 25 & 31, d4, this.aSlice(0, len >> 25 & 31, d5));
				return d5;
			case 4:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				d2 = this.aSetUnsafe(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
				d3 = this.aSetUnsafe(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
				d4 = this.aSetUnsafe(len >> 20 & 31, d3, this.aSlice(0, len >> 20 & 31, d4));
				return d4;
			case 3:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				d2 = this.aSetUnsafe(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
				d3 = this.aSetUnsafe(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
				return d3;
			case 2:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				d2 = this.aSetUnsafe(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
				return d2;
			case 1:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				return d1;
		}
	},
	reverseNduce: function reduceRight(apply, fn, seed, list) {
		var pre = list.pre,
			len = list.length - (pre && pre.length || 0),
			treeLen = len >>> 5 << 5,
			tailLen = len & 31;
		if (tailLen) {
			var tail = list.aft;
			var i = tail.length;
			while (i--) {
				seed = apply(fn, tail[i], seed);
			}
		}
		if (treeLen) {
			seed = this.reverseTreeNduce(apply, fn, seed, list.root, this.depthFromLength(treeLen), 0, treeLen);
		}
		if (pre) {
			var head = this.llToArray(pre);
			var i = head.length;
			while (i--) {
				seed = apply(fn, head[i], seed);
			}
		}
		return seed;
	},
	reverseTreeNduce: function reverseTreeReduce(apply, fn, seed, tree, depth, start, i) {
		var d0, d1, d2, d3, d4, d5, j;
		i--;
		switch (depth) {
			case 5:
				d5 = tree;
				d4 = d5[i >>> 25 & 31];
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 4:
				d4 = tree;
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 3:
				d3 = tree;
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 2:
				d2 = tree;
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 1:
				d1 = tree;
				d0 = d1[i >>> 5 & 31];
				break;
		}
		d5End: while (true) {
			var d4Stop = (i >>> 25 << 25) - 1;
			d4End: while (true) {
				var d3Stop = (i >>> 20 << 20) - 1;
				d3End: while (true) {
					var d2Stop = (i >>> 15 << 15) - 1;
					d2End: while (true) {
						var d1Stop = (i >>> 10 << 10) - 1;
						d1End: while (true) {
							var d0stop = (i >>> 5 << 5) - 1;
							while (i !== d0stop) {
								seed = apply(fn, seed, d0[i & 31], i);
								if (i == start) break d5End;
								i--;
							}
							if (i === d1Stop) break d1End;
							d0 = d1[i >>> 5 & 31];
						}
						if (!d2 || i === d2Stop) break d2End;
						d1 = d2[i >>> 10 & 31];
						d0 = d1[i >>> 5 & 31];
					}
					if (!d3 || i === d3Stop) break d3End;
					d2 = d3[i >>> 15 & 31];
					d1 = d2[i >>> 10 & 31];
					d0 = d1[i >>> 5 & 31];
				}
				if (!d4 || i === d4Stop) break d4End;
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
			}
			if (!d5 || i < 0) break d5End;
			d4 = d5[i >>> 25 & 31];
			d3 = d4[i >>> 20 & 31];
			d2 = d3[i >>> 15 & 31];
			d1 = d2[i >>> 10 & 31];
			d0 = d1[i >>> 5 & 31];
		}
		return seed;
	},
	nduceTree: function nduceTree(apply, fn, seed, i, end, depth, tree, offset) {
		var d0, d1, d2, d3, d4, d5, j;
		if (i == end) return seed;
		switch (depth) {
			case 5:
				d5 = tree;
				d4 = d5[i >>> 25 & 31];
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 4:
				d4 = tree;
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 3:
				d3 = tree;
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 2:
				d2 = tree;
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 1:
				d1 = tree;
				d0 = d1[i >>> 5 & 31];
				break;
		}
		d5End: while (true) {
			d4End: while (true) {
				d3End: while (true) {
					d2End: while (true) {
						d1End: while (true) {
							var end0 = i + 32 >>> 5 << 5;
							while (i < end0) {
								seed = apply(fn, d0[i & 31], seed, i + offset);
								i++;
								if (i == end) break d5End;
							}
							if (!(j = i >>> 5 & 31)) {
								break d1End;
							}
							d0 = d1[j];
						}
						if (!d2 || (i >>> 10 & 31) == 0) {
							break d2End;
						}
						d1 = d2[i >>> 10 & 31];
						d0 = d1[i >>> 5 & 31];
					}
					if (!d3 || (i >>> 15 & 31) == 0) {
						break d3End;
					}
					d2 = d3[i >>> 15 & 31];
					d1 = d2[i >>> 10 & 31];
					d0 = d1[i >>> 5 & 31];
				}
				if (!d4 || (i >>> 20 & 31) == 0) {
					break d4End;
				}
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
			}
			if (!d5 || (i >>> 25 & 31) == 0) {
				break d5End;
			}
			d4 = d5[i >>> 25 & 31];
			d3 = d4[i >>> 20 & 31];
			d2 = d3[i >>> 15 & 31];
			d1 = d2[i >>> 10 & 31];
			d0 = d1[i >>> 5 & 31];
		}
		return seed;
	},
	nduce: function nduce(apply, fn, seed, list, offset) {
		var pre = list.pre,
			preLen = pre && pre.length || 0,
			len = list.length - (pre && pre.length || 0),
			origin = list.originOffset || 0,
			treeLen = len + origin >>> 5 << 5,
			tailLen = len + origin & 31;
		var pI = 0;
		while (pre) {
			seed = apply(fn, pre.data, seed, pI + offset);
			pI++;
			pre = pre.link;
		}
		if (treeLen) {
			seed = this.nduceTree(apply, fn, seed, origin, treeLen, this.depthFromLength(treeLen), list.root, preLen + offset);
		}
		if (tailLen) {
			var tail = list.aft;
			var _offset = preLen + treeLen + offset;
			for (var i = 0; tailLen > i; i++) {
				seed = apply(fn, tail[i], seed, _offset + i);
			}
		}
		return seed;
	},

	squash: function squash(list) {
		var pre = list.pre,
			preLen = pre && pre.length || 0,
			root = list.root,
			len = list.length;
		if (preLen > 0 && len <= 64) {
			var merged = this.llToArray(pre).concat(root && root[0] || []).concat(list.aft);
			list.pre = null;
			list.root = [merged.slice(0, 32)];
			list.aft = merged.length > 32 ? merged.slice(32) : null;
		}
		if (len < 32 && !list.aft) {
			list.aft = (root && root[0] || []).slice(0, len);
			list.root = null;
		}
		return list;
	},
	nth: function nth(i, list, notFound) {
		var tree = list.root,
			pre = list.pre,
			totalLength = list.length,
			preLen = pre && pre.length || 0,
			origin = list.originOffset || 0;
		if (i < 0) {
			i += totalLength;
		}
		if (i < 0 || totalLength <= i) {
			return notFound;
		}
		if (i < preLen) {
			for (var n = 0; n !== i; n++) {
				pre = pre.link;
			}
			return pre.data;
		}
		i -= preLen;
		var len = totalLength - preLen;
		var treeLen = len + origin >>> 5 << 5;
		if (origin) i += origin;
		if (!tree || i >= treeLen) return list.aft[i & 31];
		if (treeLen <= 1024) return tree[i >> 5 & 31][i & 31];
		if (treeLen <= 32768) return tree[i >> 10 & 31][i >> 5 & 31][i & 31];
		if (treeLen <= 1048576) return tree[i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
		if (treeLen <= 33554432) return tree[i >> 20 & 31][i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
		if (treeLen <= 1073741824) return tree[i >> 25 & 31][i >> 20 & 31][i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
		return this.IllegalRange('range cannot be higher than 1,073,741,824');
	},
	empty: function empty() {
		return new this.Vector();
	},

	append: function append(value, list) {
		var vec = this.clone(list),
			preLen = vec.pre && vec.pre.length || 0,
			aft = vec.aft,
			aftLen = aft && aft.length || 0,
			totalLength = vec.length,
			newLength = totalLength + 1,
			origin = list.originOffset || 0,
			len = totalLength - preLen,
			treeLen = len + origin >>> 5 << 5,
			tailLen = len + origin & 31;
		if (this.OCCULANCE_ENABLE) {
			if (!aft) {
				aft = vec.aft = [];
			}
			if (tailLen != aftLen) {
				aft = vec.aft = this.aSlice(0, tailLen, aft);
			}
			aft.push(value);
		} else {
			vec.aft = this.aPush(value, aft || []);
		}
		if (tailLen + 1 === 32) {
			vec.root = this.appendLeafOntoTree(aft, vec.root, treeLen);
			vec.aft = null;
		}
		vec.length = newLength;
		return vec;
	},
	appendUnsafe: function appendUnsafe(value, vec) {
		var aft = vec.aft || (vec.aft = []),
			totalLength = vec.length,
			preLen = vec.pre && vec.pre.length || 0,
			len = totalLength - preLen,
			newLength = totalLength + 1,
			origin = vec.originOffset || 0
			,
			tailLen = len + origin & 31;
		aft.push(value);
		if (tailLen + 1 === 32) {
			var treeLen = len + 1 - 32 + (vec.originOffset || 0) >>> 5 << 5;
			vec.root = this.appendLeafOntoTreeUnsafe(aft, vec.root, treeLen);
			vec.aft = null;
		}
		vec.length = newLength;
		return vec;
	},
	prepend: function prepend(value, list) {
		var vec = this.clone(list),
			totalLength = vec.length,
			newLength = totalLength + 1;
		var pre = this.addLL(value, vec.pre);
		if (pre.length === 32) {
			vec.root = this.prependLeafOntoTree(this.llToArray(pre), vec, newLength - 32 >>> 5 << 5);
			vec.pre = null;
		} else {
			vec.pre = pre;
		}
		vec.length = newLength;
		return vec;
	},
	update: function update(i, value, list) {
		var length = list.length,
			pre = list.pre,
			preLen = pre && pre.length || 0,
			len = length - preLen,
			treeLen = len >>> 5 << 5,
			tailLen = len & 31,
			n = i - preLen;
		if (!length) return list;
		var vec = this.clone(list);
		if (preLen > i) {
			var newPre = this.llToArray(pre);
			newPre[i] = value;
			newPre = this.arrayToLL(newPre);
			vec.pre = newPre;
			return vec;
		}
		if (i > preLen + treeLen) {
			vec.aft = vec.aft ? this.aSlice(0, tailLen, vec.aft) : null;
			vec.aft[n & 31] = value;
			return vec;
		}
		var d0,
			d1,
			d2,
			d3,
			d4,
			d5,
			depth = this.depthFromLength(treeLen),
			tree = vec.root;
		switch (depth) {
			case 5:
				d5 = tree;
				d4 = d5[n >> 25 & 31];
				d3 = d4[n >> 20 & 31];
				d2 = d3[n >> 15 & 31];
				d1 = d2[n >> 10 & 31];
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				d2 = this.aSet(n >> 10 & 31, d1, d2);
				d3 = this.aSet(n >> 15 & 31, d2, d3);
				d4 = this.aSet(n >> 20 & 31, d3, d4);
				d5 = this.aSet(n >> 25 & 31, d4, d5);
				vec.root = d5;
				break;
			case 4:
				d4 = tree;
				d3 = d4[n >> 20 & 31];
				d2 = d3[n >> 15 & 31];
				d1 = d2[n >> 10 & 31];
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				d2 = this.aSet(n >> 10 & 31, d1, d2);
				d3 = this.aSet(n >> 15 & 31, d2, d3);
				d4 = this.aSet(n >> 20 & 31, d3, d4);
				vec.root = d4;
				break;
			case 3:
				d3 = tree;
				d2 = d3[n >> 15 & 31];
				d1 = d2[n >> 10 & 31];
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				d2 = this.aSet(n >> 10 & 31, d1, d2);
				d3 = this.aSet(n >> 15 & 31, d2, d3);
				vec.root = d3;
			case 2:
				d2 = tree;
				d1 = d2[n >> 10 & 31];
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				d2 = this.aSet(n >> 10 & 31, d1, d2);
				vec.root = d2;
				break;
			case 1:
				d1 = tree;
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				vec.root = d1;
				break;
		}
		return vec;
	},
	take: function take(n, list) {
		var length = list.length,
			pre = list.pre,
			preLen = pre && pre.length || 0,
			len = length - preLen,
			treeLen = len >>> 5 << 5,
			vec = this.empty();
		vec.length = n;
		if (n == 0) {
			return vec;
		}
		if (n < 0) {
			n += length;
		}
		if (n >= length) {
			return list;
		}
		if (n < preLen) {
			vec.aft = this.aSlice(0, n, this.llToArray(pre));
			return vec;
		}
		if (treeLen + preLen < n) {
			var _end = len & 31;
			vec.aft = _end ? this.aSlice(0, _end, list.aft) : null;
			vec.root = list.root;
			vec.pre = pre;
			return vec;
		}
		var _newTreeLen = n - preLen;
		var depth = this.depthFromLength(treeLen);
		if (_newTreeLen < 32) {
			vec.aft = this.trimTail(list.root, depth, _newTreeLen);
		} else {
			vec.aft = (_newTreeLen & 31) == 0 ? null : this.trimTail(list.root, depth, _newTreeLen);
			vec.root = this.trimTreeHeight(list.root, depth, _newTreeLen >>> 5 << 5);
		}
		vec.pre = pre;
		if (preLen > 0 && n <= 64) {
			return this.squash(vec);
		}
		return vec;
	},
	drop: function drop(n, list) {
		var length = list.length,
			newLength = length - n,
			pre = list.pre,
			preLen = pre && pre.length || 0,
			len = length - preLen,
			treeLen = len >>> 5 << 5,
			tailLen = len & 31,
			vec = this.empty(),
			d1,
			d2,
			d3,
			d4,
			d5
			,
			i1,
			i2,
			i3,
			i4,
			i5
			,
			t0,
			t1,
			t2,
			t3;
		if (n < 0) {
			n += length;
		}
		if (n >= length) {
			return vec;
		}
		vec.length = newLength;
		if (preLen > n) {
			var _n = preLen - n;
			while (pre.length != _n) {
				pre = pre.link;
			}
			vec.pre = pre;
			vec.root = list.root;
			vec.aft = list.aft;
			return vec;
		}
		if (n > preLen + treeLen) {
			vec.aft = this.aSlice(tailLen - vec.length, tailLen, list.aft);
			return vec;
		}
		var newRoot;
		var depth = this.depthFromLength(treeLen);
		var originOffset = list.originOffset || 0;
		var start = n - preLen - originOffset;
		var newTreeLen = treeLen - start;
		var newDepth = this.depthFromLength(newTreeLen);
		switch (depth) {
			case 5:
				d5 = list.root;
				d4 = d5[i5 = start >> 25 & 31];
				d3 = d4[i4 = start >> 20 & 31];
				d2 = d3[i3 = start >> 15 & 31];
				d1 = d2[i2 = start >> 10 & 31];
				t0 = i5;
				t1 = i4;
				t2 = i3;
				t3 = i2;
				break;
			case 4:
				d4 = list.root;
				d3 = d4[i4 = start >> 20 & 31];
				d2 = d3[i3 = start >> 15 & 31];
				d1 = d2[i2 = start >> 10 & 31];
				t0 = i4;
				t1 = i3;
				t2 = i2;
				break;
			case 3:
				d3 = list.root;
				d2 = d3[i3 = start >> 15 & 31];
				d1 = d2[i2 = start >> 10 & 31];
				t0 = i3;
				t1 = i2;
				break;
			case 2:
				d2 = list.root;
				d1 = d2[i2 = start >> 10 & 31];
				t0 = i2;
				break;
			case 1:
				d1 = list.root;
				t0 = 0;
				break;
		}
		var unDrop = 0;
		switch (depth - newDepth) {
			case 4:
			case 3:
				unDrop += t3 * this.DEPTHS[depth - 4];
				break;
			case 2:
				unDrop += t2 * this.DEPTHS[depth - 3];
				break;
			case 1:
				unDrop += t1 * this.DEPTHS[depth - 2];
			case 0:
				unDrop += t0 * this.DEPTHS[depth - 1];
		}
		switch (newDepth) {
			case 5:
				newRoot = i5 ? this.aSlice(i5, d5.length, d5) : d5;
				break;
			case 4:
				newRoot = i4 ? this.aSlice(i4, d4.length, d4) : d4;
				break;
			case 3:
				newRoot = i3 ? this.aSlice(i3, d3.length, d3) : d3;
				break;
			case 2:
				newRoot = i2 ? this.aSlice(i2, d2.length, d2) : d2;
				break;
			case 1:
				newRoot = i1 ? this.aSlice(i1, d1.length, d1) : d1;
				break;
		}
		vec.originOffset = start - unDrop;
		vec.pre = null;
		vec.root = newRoot;
		vec.aft = list.aft;
		return vec;
	},
	appendAll: function appendAll(left, right) {
		var vec = this.clone(left),
			leftPre = left.pre,
			leftPreLength = leftPre && leftPre.length || 0,
			leftLength = left.length,
			leftTreeLength = leftLength - leftPreLength >>> 5 << 5,
			leftTailLength = leftLength - leftPreLength & 31;
		vec.root = left.root ? this.trimTree(left.root, this.depthFromLength(leftTreeLength), leftTreeLength) : null;
		vec.aft = vec.aft ? this.aSlice(0, leftTailLength, vec.aft) : null;
		vec = this.foldl(this.appendUnsafe.bind(this), vec, right);
		return this.squash(vec);
	},
	// reduce: function reduce(fn, seed, list) {
	// 	return this.nduce(this._reduceApply, fn, seed, list, 0);
	// },
	foldl: function foldl(fn, seed, list) {
		return this.nduce(this._foldlApply, fn, seed, list, 0);
	},
	map: function map(fn, list) {
		return this.nduce(this._mapApply, fn, this.empty(), list, 0);
	},
	filter: function filter(predicate, list) {
		return this.nduce(this._filterApply, predicate, this.empty(), list, 0);
	},
	// reduceRight: function reduceRight(fn, seed, list) {
	// 	var pre = list.pre,
	// 		len = list.length - (pre && pre.length || 0),
	// 		treeLen = len >>> 5 << 5,
	// 		tailLen = len & 31;
	// 	if (tailLen) {
	// 		var tail = list.aft;
	// 		var i = tail.length;
	// 		while (i--) {
	// 			seed = fn(seed, tail[i]);
	// 		}
	// 	}
	// 	if (treeLen) {
	// 		seed = this.reverseTreeReduce(fn, seed, list.root, this.depthFromLength(treeLen), 0, treeLen);
	// 	}
	// 	if (pre) {
	// 		var head = this.llToArray(pre);
	// 		var i = head.length;
	// 		while (i--) {
	// 			seed = fn(seed, head[i]);
	// 		}
	// 	}
	// 	return seed;
	// },
	find: function find(predicate, list) {
		try {
			return this.nduce(this._findApply, predicate, this.NotFound, list, 0);
		} catch (e) {
			if (e.isCancelToken) {
				return e;
			} else {
				throw e;
			}
		}
	},






	A2dir: function(fn, a, b) {
		return fn.func(a, b)
	}
	, A2casc: function(fn, a, b) {
		return fn(a)(b)
	}
	, A2: function(fn) {
		return fn.arity === 2 ? this.A2dir : this.A2casc
	}
	, elmFoldl: function(fn, seed, list) {
		return this.nduce(this.A2(fn), fn, seed, list, 0);
	}
	, elmFoldr: function(fn, seed, list) {
		return this.reverseNduce(this.A2(fn), fn, seed, list);
	}
	, indexOf: function indexOf(value, vec) {
		return this.find(value, vec).index
	}
	, includes: function(value, vec) {
		return this.indexOf(value, vec) !== -1
	}
	, every: function every(predicate, vec) {
		return this.find(function(value) {
			return !predicate(value)
		}, vec).index == -1;
	}
	, some: function some(predicate, vec) {
		return this.find(predicate, vec).index !== -1;
	}
	, of: function of(value) {
		return this.appendUnsafe(value, this.empty());
	}
	// , of: function of() {
	// 	for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
	// 		values[_key] = arguments[_key];
	// 	}
	// 	if (values.length > 32) {
	// 	}
	// 	var vec = new Vector(values.length);
	// 	vec.aft = values;
	// 	return vec;
	// }
	, initialize: function fastInitialize(length, fn) {
		var vec = this.empty()
		if (length <= 0) return vec

		var init = this.aInit
		var rootLen = this.tailOffset(length)
		var depth = this.depthFromLength(rootLen)
		vec.root = this.fastInitRecurse(fn, depth, 0, rootLen, init)
		vec.aft = init(fn, rootLen, length)
		vec.length = length
		return vec
	}
	, fastInitRecurse: function fastInitRecurse(fn, depth, from, to, initBlock) {

		if (depth === 0) {
			return initBlock(fn, from, to)
		}

		var step = Math.pow(32, depth);
		var table = new Array(Math.ceil((to - from) / step));

		for (var i = 0; i < table.length; i++) {
			table[i] = fastInitRecurse(fn, depth - 1, from + (i * step), Math.min(from + ((i + 1) * step), to), initBlock);
		}
		return table
	}
	, range: function range(start, end) {
		var vec = empty();
		for (; start < end; start++) {
			vec = this.appendUnsafe(start, vec)
		}
		return vec;
	}
	, removeAt: function removeAt(i, vec) {
		return this.appendAll(this.take(i, vec), this.drop(i + 1, vec));
	}
	, remove: function remove(value, vec) {
		var i = this.find(function(val) {
			return val === value
		}, vec).index;
		return i === -1 ? vec : this.removeAt(i, vec);
	}
	, insertAt: function insertAt(i, value, vec) {
		return this.appendAll(this.append(value, this.take(i, vec)), this.drop(i, vec));
	}
};

Object.assign(Cassowry, {
	_reduceApply: function _reduceApply(fn, value, acc, index) {
		return fn(acc, value);
	},
	_foldlApply: function _foldlApply(fn, value, acc, index) {
		return fn(value, acc);
	},
	_mapApply: function _mapApply(fn, value, acc, index) {
		return this.appendUnsafe(fn(value), acc);
	}.bind(Cassowry),
	_indexedMapApply: function _indexedMapApply(fn, value, acc, index) {
		return this.appendUnsafe(fn(value, index), acc);
	}.bind(Cassowry),
	_filterApply: function _filterApply(fn, value, list, index) {
		return fn(value) ? this.appendUnsafe(value, list) : list;
	}.bind(Cassowry),
	_findApply: function _findApply(fn, value, acc, index) {
		return fn(value) ? this.cancel(value, index) : acc;
	}.bind(Cassowry),
	appendUnsafe: Cassowry.appendUnsafe.bind(Cassowry)
})


var nth = Cassowry.nth.bind(Cassowry)
	, appendUnsafe = Cassowry.appendUnsafe.bind(Cassowry)
	, empty = Cassowry.empty.bind(Cassowry)
	, foldr = Cassowry.elmFoldr.bind(Cassowry)
	, foldl = Cassowry.elmFoldl.bind(Cassowry)
	, of = Cassowry.of.bind(Cassowry)

function fromArray(array) {
	var vec = empty();
	var add = appendUnsafe
	for (var i = 0, len = array.length; len > i; i++) {
		vec = add(array[len], vec);
	}
	return vec;
}

/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 */
function naturalSort(a, b) {
	"use strict";
	var re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
		sre = /(^[ ]*|[ ]*$)/g,
		dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
		hre = /^0x[0-9a-f]+$/i,
		ore = /^0/,
		i = function(s) {
			return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s;
		},
		// convert all to strings strip whitespace
		x = i(a).replace(sre, '') || '',
		y = i(b).replace(sre, '') || '',
		// chunk/tokenize
		xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
		yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
		// numeric, hex or date detection
		xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
		yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
		oFxNcL, oFyNcL;
	// first try and sort Hex codes or Dates
	if (yD) {
		if (xD < yD) {
			return -1;
		}
		else if (xD > yD) {
			return 1;
		}
	}
	// natural sorting through split numeric strings and default strings
	for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
		// find floats not starting with '0', string or 0 if not defined (Clint Priest)
		oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
		oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
		// handle numeric vs string comparison - number < string - (Kyle Adams)
		if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
			return (isNaN(oFxNcL)) ? 1 : -1;
		}
		// rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
		else if (typeof oFxNcL !== typeof oFyNcL) {
			oFxNcL += '';
			oFyNcL += '';
		}
		if (oFxNcL < oFyNcL) {
			return -1;
		}
		if (oFxNcL > oFyNcL) {
			return 1;
		}
	}
	return 0;
}


function sortWith(fn, vec) {
	var arr = foldl(function(value, arr) {
		arr.push(value);
		return arr;
	}, [], vec);

	return fromArray(arr.sort(fn))
}

function sort(vec) {
	return sortWith(naturalSort, vec)
}


var _rrbit_org$rrbit_elm$Native_Rrbit = {
	initialize: F2(Cassowry.initialize.bind(Cassowry))
	, prepend: F2(Cassowry.prepend.bind(Cassowry))
	, append: F2(Cassowry.append.bind(Cassowry))
	, appendAll: F2(Cassowry.appendAll.bind(Cassowry))
	, update: F3(Cassowry.update.bind(Cassowry))
	, foldl: F3(foldl)
	, foldr: F3(foldr)
	, nth: F3(Cassowry.nth.bind(Cassowry))
	, map: F2(Cassowry.map.bind(Cassowry))
	, filter: F2(Cassowry.filter.bind(Cassowry))
	, take: F2(Cassowry.take.bind(Cassowry))
	, drop: F2(Cassowry.drop.bind(Cassowry))
	, empty: empty
	, range: F2(Cassowry.range.bind(Cassowry))
	, find: F2(Cassowry.find.bind(Cassowry))
	, every: F2(Cassowry.every.bind(Cassowry))
	, some: F2(Cassowry.some.bind(Cassowry))
	, insertAt: F2(Cassowry.insertAt.bind(Cassowry))
	, remove: F2(Cassowry.remove.bind(Cassowry))
	, removeAt: F2(Cassowry.removeAt.bind(Cassowry))
	, indexOf: F2(Cassowry.indexOf.bind(Cassowry))
	, includes: F2(Cassowry.includes.bind(Cassowry))
	, fromArray: fromArray
	, sort: sort
	, 'of': Cassowry.of.bind(Cassowry)
	, length: function(vec) {
		return vec.length;
	}
};
