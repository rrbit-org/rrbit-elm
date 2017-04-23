var _rrbit_org$rrbit_elm$Native_Rrbit = function() {

	'use strict';

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

	function Finder(predicate) {
		this.predicate = predicate;
	}

	Finder.prototype.Found = CancelToken;
	Finder.prototype.NotFound = new CancelToken(null, -1);
	Finder.prototype.step = function(_, value, index) {
		return this.predicate(value) ? new this.Found(value, index) : this.NotFound;
	};
	Finder.prototype.toReducer = function() {
		return this.step.bind(this);
	};
	var Cassowry = {
		A2: A2,
		A3: A3,
		OCCULANCE_ENABLE: true,
		Vector: Vector,
		CancelToken: CancelToken,
		isCancelled: function isCancelled(value) {
			return value instanceof this.CancelToken;
		},
		done: function done(value, index, depth) {
			return new this.CancelToken(value, index, depth);
		},
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
		SinglyLinkedList: function SinglyLinkedList(data, len, next) {
			this.data = data;
			this.link = next;
			this.length = len;
		},
		IllegalRange: function IllegalRange(msg) {
			throw new RangeError(msg || 'out of range');
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
		aSetǃ: function aSet(index, value, arr) {
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
		depthFromLength: function(len) {
			if (len <= 1024) return 1;
			if (len <= 32768) return 2;
			if (len <= 1048576) return 3;
			if (len <= 33554432) return 4;
			if (len <= 1073741824) return 5;
			return 6;
		},
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
		appendLeafOntoTreeǃ: function appendLeafOntoTree(leaf, tree, i) {
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
		prependLeafOntoTree: function prependLeafOntoTree(leaf, tree, treeLen) {
			var d1, d2, d3, d4, n1, n2, n3, n4;
			if (!tree || treeLen == 0) {
				return [leaf];
			}
			if (treeLen <= 1024) {
				return tree.length == 32 ? [[leaf], tree] : this.aUnshift(leaf, tree);
			}
			if (treeLen <= 32768) {
				this.IllegalRange("can't prepend more than 1024...yet :(");
				d1 = tree[0];
				n1 = d1.length === 32 ? [leaf] : this.aUnshift(leaf, d1);
				if (d1.length === 32) {
					return tree.length == 32 ? [[n1], tree] : this.aUnshift(n1, tree);
				}
				return this.aSet(0, n1, tree);
			}
			if (treeLen <= 1048576) {
				d2 = tree[0];
				d1 = d2[0];
				n1 = d1.length === 32 ? [leaf] : this.aUnshift(leaf, d1);
				n2 = d1.length !== 32 ? this.aSet(0, n1, d2) : d2.length === 32 ? [n1] : this.aUnshift(n1, d2);
				if (n2.length === 1 && d2.length == 32) {
					return tree.length == 32 ? [[n2], tree] : this.aUnshift(n2, tree);
				}
				return this.aSet(0, n2, tree);
			}
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
					d2 = this.aSetǃ(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
					d3 = this.aSetǃ(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
					d4 = this.aSetǃ(len >> 20 & 31, d3, this.aSlice(0, len >> 20 & 31, d4));
					d5 = this.aSetǃ(len >> 25 & 31, d4, this.aSlice(0, len >> 25 & 31, d5));
					return d5;
				case 4:
					d1 = this.aSlice(0, len >> 5 & 31, d1);
					d2 = this.aSetǃ(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
					d3 = this.aSetǃ(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
					d4 = this.aSetǃ(len >> 20 & 31, d3, this.aSlice(0, len >> 20 & 31, d4));
					return d4;
				case 3:
					d1 = this.aSlice(0, len >> 5 & 31, d1);
					d2 = this.aSetǃ(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
					d3 = this.aSetǃ(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
					return d3;
				case 2:
					d1 = this.aSlice(0, len >> 5 & 31, d1);
					d2 = this.aSetǃ(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
					return d2;
				case 1:
					d1 = this.aSlice(0, len >> 5 & 31, d1);
					return d1;
			}
		},
		reverseTreeFold: function reverseTreeReduce(fn, seed, tree, depth, start, i) {
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
									seed = this.A2(fn, d0[i & 31], seed, i);
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
		cancelableTreeReduce: function cancelableTreeReduce(fn, seed, tree, depth, i, end) {
			var d0, d1, d2, d3, d4, d5, j;
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
								var end0 = i + 32;
								while (i < end0) {
									if (i == end) break d5End;
									seed = fn(seed, d0[i & 31], i);
									if (this.isCancelled(seed)) {
										break d5End;
									}
									i++;
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
		cancelableReduce: function cancelableReduce(fn, seed, list) {
			var pre = list.pre,
				len = list.length - (pre && pre.length || 0),
				treeLen = len >>> 5 << 5,
				tailLen = len & 31;
			while (pre && !this.isCancelled(seed)) {
				seed = fn(seed, pre.data);
				pre = pre.link;
			}
			if (treeLen && !this.isCancelled(seed)) {
				seed = this.cancelableTreeReduce(fn, seed, list.root, this.depthFromLength(treeLen), 0, treeLen);
			}
			if (tailLen && !this.isCancelled(seed)) {
				var tail = list.aft;
				for (var i = 0; tailLen > i && !this.isCancelled(seed); i++) {
					seed = fn(seed, tail[i]);
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
				preLen = pre && pre.length || 0;
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
			var treeLen = len >>> 5 << 5;
			if (len < 32 || i >= treeLen) return list.aft[i & 31];
			if (list.originOffset) i += list.originOffset;
			if (treeLen < 32) return tree[i & 31];
			if (treeLen <= 1024) return tree[i >> 5 & 31][i & 31];
			if (treeLen <= 32768) return tree[i >> 10 & 31][i >> 5 & 31][i & 31];
			if (treeLen <= 1048576) return tree[i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
			if (treeLen <= 33554432) return tree[i >> 20 & 31][i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
			if (treeLen <= 1073741824) return tree[i >> 25 & 31][i >> 20 & 31][i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
			return this.IllegalRange('range cannot be higher than 1,073,741,824');
		},
		empty: function empty() {
			return this.factory();
		},
		append: function append(value, list) {
			var vec = this.clone(list),
				aft = vec.aft,
				aftLen = aft && aft.length || 0,
				totalLength = vec.length,
				newLength = totalLength + 1;
			if (this.OCCULANCE_ENABLE) {
				var aftDelta = vec.length & 31;
				if (aftDelta != aftLen) {
					aft = vec.aft = this.aSlice(0, aftDelta, aft);
				}
				if (!aft) {
					aft = vec.aft = [];
				}
				aft.push(value);
			} else {
				vec.aft = this.aPush(value, aft || []);
			}
			if ((newLength & 31) === 0) {
				vec.root = this.appendLeafOntoTree(aft, vec.root, newLength - 32 >>> 5 << 5);
				vec.aft = null;
			}
			vec.length = newLength;
			return vec;
		},
		appendǃ: function append(value, vec) {
			var aft = vec.aft || (vec.aft = []),
				totalLength = vec.length,
				newLength = totalLength + 1;
			aft.push(value);
			if ((newLength & 31) === 0) {
				vec.root = this.appendLeafOntoTreeǃ(aft, vec.root, newLength - 32 >>> 5 << 5);
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
			if (pre.length == 32) {
				vec.root = this.prependLeafOntoTree(this.llToArray(pre), vec.root, newLength - 32 >>> 5 << 5);
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
				d0,
				d1,
				d2,
				d3,
				d4,
				d5;
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
			var newRoot, newPre;
			var depth = this.depthFromLength(treeLen);
			var start = n - preLen;
			var newTreeLen = treeLen - start;
			var newDepth = this.depthFromLength(newTreeLen);
			switch (depth) {
				case 5:
					d5 = list.root;
					d4 = d5[start >> 25 & 31];
					d3 = d4[start >> 20 & 31];
					d2 = d3[start >> 15 & 31];
					d1 = d2[start >> 10 & 31];
				case 4:
					d4 = list.root;
					d3 = d4[start >> 20 & 31];
					d2 = d3[start >> 15 & 31];
					d1 = d2[start >> 10 & 31];
				case 3:
					d3 = list.root;
					d2 = d3[start >> 15 & 31];
					d1 = d2[start >> 10 & 31];
				case 2:
					d3 = list.root;
					d1 = d2[start >> 10 & 31];
				case 1:
					d1 = list.root;
					break;
			}
			switch (depth - newDepth) {
				case 4:
					break;
				case 3:
					break;
				case 2:
					break;
				case 1:
					break;
				case 0:
					break;
			}
			switch (newDepth) {
				case 5:
				case 4:
				case 3:
				case 2:
					this.IllegalRange('cannot drop when length is more than 1024...yet');
					break;
				case 1:
					newPre = this.aSlice(start & 31, 32, d1[start >> 5 & 31]);
					var x = (start >> 5 & 31) + 1;
					d1 = this.aSlice(x, d1.length, d1);
					newRoot = d1.length ? d1 : null;
					break;
			}
			vec.pre = this.arrayToLL(newPre);
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
			vec = this.reduce(function addToLeft(list, value) {
				return this.appendǃ(value, list);
			}.bind(this), vec, right);
			return this.squash(vec);
		},
		reduce: function reduce(fn, seed, list) {
			return this.cancelableReduce(fn, seed, list);
		},
		foldr: function foldr(fn, seed, list) {
			var pre = list.pre,
				len = list.length - (pre && pre.length || 0),
				treeLen = len >>> 5 << 5,
				tailLen = len & 31;
			if (tailLen) {
				var tail = list.aft;
				var i = tail.length;
				while (i--) {
					seed = this.A2(fn, tail[i], seed);
				}
			}
			if (treeLen) {
				seed = this.reverseTreeFold(fn, seed, list.root, this.depthFromLength(treeLen), 0, treeLen);
			}
			if (pre) {
				var head = this.llToArray(pre);
				var i = head.length;
				while (i--) {
					seed = this.A2(fn, tail[i], seed);
				}
			}
			return seed;
		},
		Finder: Finder,
		find: function find(predicate, list) {
			return this.cancelableReduce(new this.Finder(predicate).toReducer(), null, list);
		},
		indexOf: function indexOf(value, vec) {
			return this.find(value, vec).index
		},
		includes: function includes(value, vec) {
			return this.find(value, vec).index !== -1
		},
		every: function every(predicate, vec) {
			return this.find(function(value) {
					return !predicate(value)
				}, vec).index == -1;
		},
		some: function some(predicate, vec) {
			return this.find(predicate, vec).index !== -1;
		},
		of: function of(value) {
			return this.appendǃ(value, this.empty());
		},
		removeAt: function removeAt(i, vec) {
			return this.appendAll(this.take(i, vec), this.drop(i + 1, vec));
		},

		remove: function remove(value, vec) {
			var i = this.find(function(val) {
				return val === value
			}, vec).index;
			return i === -1 ? vec : this.removeAt(i, vec);

		},

		insertAt: function insertAt(i, value, vec) {
			return this.appendAll(this.append(value, this.take(i, vec)), this.drop(i, vec));
		}
	};


	var nth = Cassowry.nth.bind(Cassowry)
		, drop = Cassowry.drop.bind(Cassowry)
		, take = Cassowry.take.bind(Cassowry)
		, update = Cassowry.update.bind(Cassowry)
		, prepend = Cassowry.prepend.bind(Cassowry)
		, append = Cassowry.append.bind(Cassowry)
		, appendǃ = Cassowry.appendǃ.bind(Cassowry)
		, appendAll = Cassowry.appendAll.bind(Cassowry)
		, empty = Cassowry.empty.bind(Cassowry)
		, reduce = Cassowry.reduce.bind(Cassowry)
		, foldr = Cassowry.foldr.bind(Cassowry)
		, find = Cassowry.find.bind(Cassowry)
		, indexOf = Cassowry.indexOf.bind(Cassowry)
		, includes = Cassowry.includes.bind(Cassowry)
		, every = Cassowry.every.bind(Cassowry)
		, some = Cassowry.some.bind(Cassowry)
		, of = Cassowry.of.bind(Cassowry)
		, remove = Cassowry.remove.bind(Cassowry)
		, removeAt = Cassowry.removeAt.bind(Cassowry)
		, insertAt = Cassowry.insertAt.bind(Cassowry)


	function _toReducer() {
		return this.step.bind(this)
	}

	function fromArray(array) {
		var vec = empty();
		var add = appendǃ
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

	function Mapper(fn) {
		this.fn = fn;
	}

	Mapper.prototype.add = appendǃ;
	Mapper.prototype.toReducer = _toReducer;
	Mapper.prototype.step = function(list, value) {
		return this.add(this.fn(value), list);
	};

	function map(fn, vec) {
		return reduce(new Mapper(fn).toReducer(), empty(), vec);
	}


	function Filter(predicate) {
		this.predicate = predicate;
	}

	Filter.prototype.add = appendǃ;
	Filter.prototype.toReducer = _toReducer;
	Filter.prototype.step = function(list, value) {
		return this.predicate(value) ? this.add(value, list) : list
	};

	function filter(fn, vec) {
		return reduce(new Filter(fn).toReducer(), empty(), vec)
	}

	function initialize(size, fn) {
		var i = 0;
		var vec = empty();
		var add = appendǃ
		while (size > i) {
			add(fn(i++), vec);
		}
		return vec;
	}


	function foldl(fn, acc, vec) {
		return reduce(function(sum, value) {
			return A2(fn, value, sum);
		}, acc, vec);
	}

	function range(start, end) {
		var vec = empty();
		var add = appendǃ;
		for (; start < end; start++) {
			vec = add(start, vec)
		}
		return vec;
	}

	function sortWith(fn, vec) {
		var arr = reduce(function(arr, value) {
			arr.push(value);
			return arr;
		}, [], vec);

		return fromArray(arr.sort(fn))
	}

	function sort(vec) {
		return sortWith(naturalSort, vec)
	}


	return {
		initialize: F2(initialize),
		prepend: F2(prepend),
		append: F2(append),
		appendAll: F2(appendAll),
		update: F3(update),
		foldl: F3(foldl),
		foldr: F3(foldr),
		nth: F3(nth),
		map: F2(map),
		filter: F2(filter),
		take: F2(take),
		drop: F2(drop),
		empty: empty,
		range: F2(range),
		find: F2(empty),
		every: F2(every),
		some: F2(some),
		removeAt: F2(removeAt),
		insertAt: F2(insertAt),
		remove: F2(remove),
		indexOf: F2(indexOf),
		includes: F2(includes),
		sort: sort,
		'of': of,
		length: function(vec) {
			return vec.length;
		}
	}
}(function() {


}());