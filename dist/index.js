'use strict';

function css (props){ return ("@import url('https://fonts.googleapis.com/css?family=Indie+Flower|Nixie+One|Monoton|Knewave|Montserrat:400,600');\nbody, html {\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    padding: 0px;\n    font-family: 'Montserrat', sans-serif;\n}\n\n." + (props.cn) + "[container] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    width: 100%;\n    height: 100%;\n}\n\n." + (props.cn) + "[aside] {\n    width: 270px;\n    position: relative;\n    -webkit-transition: .5s ease all;\n    transition: .5s ease all;\n}\n\n." + (props.cn) + "[aside-scroll] {\n    width: 100%;\n    height: 100%;\n    overflow-x: hidden;\n    overflow-y: auto;\n    padding: 0px .5rem;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    padding-bottom: 1rem;\n}\n\n." + (props.cn) + "[content] {\n    -webkit-box-flex: 0%;\n        -ms-flex: 0%;\n            flex: 0%;\n    overflow-y: auto;\n    padding: 50px;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    background: #f1f1f9;\n}\n\n." + (props.cn) + "[aside-toggle] {\n    width: 50px;\n    height: 50px;\n    position: absolute;\n    top: 0px;\n    left: 100%;\n    background: white;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    display: flex;\n}\n\n." + (props.cn) + "[aside-hide] {\n    margin-left: -270px;\n}\n\n." + (props.cn) + " h1, ." + (props.cn) + " h2, ." + (props.cn) + " h3, ." + (props.cn) + " h4, ." + (props.cn) + " h5 {\n    font-weight: 400;\n    font-family: " + (props.fontTitle) + ";\n}\n\n." + (props.cn) + " p {\n    font-family: " + (props.fontContent) + ";\n}\n\n." + (props.cn) + " a {\n    text-decoration: none;\n    font-weight: bold;\n    color: unset;\n    padding: 0px 5px;\n}\n\n@media (max-width:720px) {\n    ." + (props.cn) + "[content] {\n        padding: 1rem;\n    }\n}"); }

var VNode = function VNode() {};

var options = {};

var stack = [];

var EMPTY_CHILDREN = [];

function h(nodeName, attributes) {
	var arguments$1 = arguments;

	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments$1[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) { stack.push(attributes.children); }
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') { child = null; }

			if (simple = typeof nodeName !== 'function') {
				if (child == null) { child = ''; }else if (typeof child === 'number') { child = String(child); }else if (typeof child !== 'string') { simple = false; }
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	if (options.vnode !== undefined) { options.vnode(p); }

	return p;
}

function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) { renderComponent(p); }
	}
}

function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) { parentNode.removeChild(node); }
}

function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') { name = 'class'; }

	if (name === 'key') ; else if (name === 'ref') {
		if (old) { old(null); }
		if (value) { value(node); }
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) { node.style[i] = ''; }
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) { node.innerHTML = value.__html || ''; }
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) { node.addEventListener(name, eventProxy, useCapture); }
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		try {
			node[name] = value == null ? '' : value;
		} catch (e) {}
		if ((value == null || value === false) && name != 'spellcheck') { node.removeAttribute(name); }
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

		if (value == null || value === false) {
			if (ns) { node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); }else { node.removeAttribute(name); }
		} else if (typeof value !== 'function') {
			if (ns) { node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); }else { node.setAttribute(name, value); }
		}
	}
}

function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

var mounts = [];

var diffLevel = 0;

var isSvgMode = false;

var hydrating = false;

function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) { options.afterMount(c); }
		if (c.componentDidMount) { c.componentDidMount(); }
	}
}

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	if (!diffLevel++) {
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	if (parent && ret.parentNode !== parent) { parent.appendChild(ret); }

	if (! --diffLevel) {
		hydrating = false;

		if (!componentRoot) { flushMounts(); }
	}

	return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	if (vnode == null || typeof vnode === 'boolean') { vnode = ''; }

	if (typeof vnode === 'string' || typeof vnode === 'number') {
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) { dom.parentNode.replaceChild(out, dom); }
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			}
			if (dom.parentNode) { dom.parentNode.replaceChild(out, dom); }

			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	} else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	diffAttributes(out, vnode.attributes, props);

	isSvgMode = prevSvgMode;

	return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			} else if (min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) { childrenLen--; }
							if (j === min) { min++; }
							break;
						}
					}
				}

			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) { recollectNodeTree(keyed[i], false); }
		}
	}

	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) { recollectNodeTree(child, false); }
	}
}

function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		unmountComponent(component);
	} else {
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) { node['__preactattr_'].ref(null); }

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

function diffAttributes(dom, attrs, old) {
	var name;

	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

var recyclerComponents = [];

function createComponent(Ctor, props, context) {
	var inst,
	    i = recyclerComponents.length;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	while (i--) {
		if (recyclerComponents[i].constructor === Ctor) {
			inst.nextBase = recyclerComponents[i].nextBase;
			recyclerComponents.splice(i, 1);
			return inst;
		}
	}

	return inst;
}

function doRender(props, state, context) {
	return this.constructor(props, context);
}

function setComponentProps(component, props, renderMode, context, mountAll) {
	if (component._disable) { return; }
	component._disable = true;

	component.__ref = props.ref;
	component.__key = props.key;
	delete props.ref;
	delete props.key;

	if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
		if (!component.base || mountAll) {
			if (component.componentWillMount) { component.componentWillMount(); }
		} else if (component.componentWillReceiveProps) {
			component.componentWillReceiveProps(props, context);
		}
	}

	if (context && context !== component.context) {
		if (!component.prevContext) { component.prevContext = component.context; }
		component.context = context;
	}

	if (!component.prevProps) { component.prevProps = component.props; }
	component.props = props;

	component._disable = false;

	if (renderMode !== 0) {
		if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) { component.__ref(component); }
}

function renderComponent(component, renderMode, mountAll, isChild) {
	if (component._disable) { return; }

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    snapshot = previousContext,
	    rendered,
	    inst,
	    cbase;

	if (component.constructor.getDerivedStateFromProps) {
		state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
		component.state = state;
	}

	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		if (isUpdate && component.getSnapshotBeforeUpdate) {
			snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || renderMode === 1) {
				if (cbase) { cbase._component = null; }
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, snapshot);
		}
		if (options.afterUpdate) { options.afterUpdate(component); }
	}

	while (component._renderCallbacks.length) {
		component._renderCallbacks.pop().call(component);
	}if (!diffLevel && !isChild) { flushMounts(); }
}

function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;

			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

function unmountComponent(component) {
	if (options.beforeUnmount) { options.beforeUnmount(component); }

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) { component.componentWillUnmount(); }

	component.base = null;

	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) { base['__preactattr_'].ref(null); }

		component.nextBase = base;

		removeNode(base);
		recyclerComponents.push(component);

		removeChildren(base);
	}

	if (component.__ref) { component.__ref(null); }
}

function Component(props, context) {
	this._dirty = true;

	this.context = context;

	this.props = props;

	this.state = this.state || {};

	this._renderCallbacks = [];
}

extend(Component.prototype, {
	setState: function setState(state, callback) {
		var prev = this.prevState = this.state;
		if (typeof state === 'function') { state = state(prev, this.props); }
		this.state = extend(extend({}, prev), state);
		if (callback) { this._renderCallbacks.push(callback); }
		enqueueRender(this);
	},
	forceUpdate: function forceUpdate(callback) {
		if (callback) { this._renderCallbacks.push(callback); }
		renderComponent(this, 2);
	},
	render: function render() {}
});

function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

function o(t,n){return e(t,n)||t.push(n),function(){t.splice(t.indexOf(n)>>>0,1);}}function e(t,n){return t.indexOf(n)>-1}function r(t,n){void 0===t&&(t=""),void 0===n&&(n=3);var o=function(t,n){void 0===n&&(n=3);for(var o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=t;n;){ --n,e+=o.charAt(Math.floor(Math.random()*o.length)); }return e}(t,n);return document.getElementsByClassName(o).length?r(t,n+1):o}var c={provider:"[[THEME]]"},i=function(t){function n(){t.call(this),this.state={cn:r("_"),handlers:[]};}return t&&(n.__proto__=t),(n.prototype=Object.create(t&&t.prototype)).constructor=n,n.prototype.commit=function(t){var n=this;this.state.handlers.forEach(function(o){return o(t,n.state.cn)});},n.prototype.getChildContext=function(){var t;return(t={})[c.provider]=this.state,t},n.prototype.componentDidMount=function(){this.commit(this.props);},n.prototype.componentWillReceiveProps=function(t){this.commit(t);},n.prototype.componentWillUnmount=function(){document.querySelectorAll("[id^=_"+this.state.cn+"_]").forEach(function(t){document.head.removeChild(t);});},n.prototype.render=function(t){return t.children[0]},n}(Component);function p(i,p){void 0===i&&(i="div"),void 0===p&&(p={});var u,s=p.cn||r("_"),a=[],d=[];return function(r){return r=[].concat(r),function(n){function h$$1(){n.apply(this,arguments);}return n&&(h$$1.__proto__=n),(h$$1.prototype=Object.create(n&&n.prototype)).constructor=h$$1,h$$1.prototype.print=function(t,n){if(!e(a,t.cn)||n){o(a,t.cn);var c=document.getElementById(t.cn)||document.createElement("style");c.id=t.cn,c.innerHTML=r.map(function(n){return n(t)}).join("\n"),document.head.appendChild(c);}this.setState(t);},h$$1.prototype.load=function(t){var n=this,r=this.context[c.provider];r?(e(a,r.cn)||(o(d,r.cn),this.disconnect=o(r.handlers,function(o){(t=Object.assign({},t,o)).cn=r.cn+s,n.print(t,!0);})),t.cn=r.cn+s):t.cn=s,this.print(t);},h$$1.prototype.componentDidMount=function(){this.load(p);},h$$1.prototype.componentWillUnmount=function(){this.disconnect&&(this.disconnect(),this.disconnect=!1);},h$$1.render=function(t){return u=t,this},h$$1.prototype.render=function(n,o){return h(n.tag||i,Object.assign({},n,{class:n.class?o.cn+" "+n.class:o.cn,children:u?u(n):n.children}))},h$$1}(Component)}}

function css$1 (props){ return ("." + (props.cn) + "[container] {\n    width: 100%;\n    height: 100%;\n    color: white;\n    background: " + (props.primary) + ";\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    padding: 0px 100px;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n}\n\n." + (props.cn) + "[container][shadow] {\n    -webkit-box-shadow: 0px 12px 22px rgba(0, 0, 0, 0.15);\n            box-shadow: 0px 12px 22px rgba(0, 0, 0, 0.15);\n}\n\n." + (props.cn) + "[container][radius] {\n    border-radius: 3px;\n}\n\n." + (props.cn) + "[group] {\n    max-width: 680px;\n}\n\n@media (max-width:720px) {\n    ." + (props.cn) + "[container] {\n        padding: 50px;\n        text-align: center;\n    }\n}\n\n@media (max-width:520px) {\n    ." + (props.cn) + "[container] {\n        padding: 1rem;\n    }\n    h1." + (props.cn) + " {\n        font-size: 22px;\n    }\n}"); }

var Layout = p("div")(css$1);

function Hero(props) {
    return (
        h( Layout, { container: true, shadow: true, radius: true }, 
            h( Layout, { group: true }, 
                h( Layout, { tag: "h1" }, props.title), 
                h( Layout, { tag: "p" }, props.content)
            )
        )
    );
}

function css$2 (props){ return ("label." + (props.cn) + " {\n    width: 40px;\n    height: 40px;\n    display: inline-block;\n    padding: 5px;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    cursor: pointer;\n}\n\nlabel." + (props.cn) + " input {\n    display: none;\n}\n\nlabel." + (props.cn) + " input:checked+div {\n    -webkit-box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.15);\n            box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.15);\n    -webkit-transform: scale(1.1);\n            transform: scale(1.1);\n}\n\nlabel." + (props.cn) + " div {\n    width: 100%;\n    height: 100%;\n    background: teal;\n    border-radius: 3px;\n    -webkit-transition: .3s ease all;\n    transition: .3s ease all;\n}"); }

var Layout$1 = p("div")(css$2);

function SelectColor(props) {
    return (
        h( Layout$1, { container: true }, 
            props.options.map(function (option, index) { return (
                h( Layout$1, { tag: "label" }, 
                    h( 'input', {
                        type: "radio", onchange: function () { return props.onchange && props.onchange(option, index); }, name: props.name || "select-color" }), 
                    h( 'div', { style: ("background:" + option) })
                )
            ); })
        )
    );
}

function css$3 (props){ return ("label." + (props.cn) + " {\n    width: 100%;\n    height: auto;\n    display: inline-block;\n    padding: 5px;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    cursor: pointer;\n}\n\nlabel." + (props.cn) + " input {\n    display: none;\n}\n\nlabel." + (props.cn) + " input:checked+div {\n    background: rgba(0, 0, 0, .1);\n}\n\nlabel." + (props.cn) + ">div {\n    width: 100%;\n    height: auto;\n    padding: 1rem;\n    background: rgba(0, 0, 0, .05);\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    font-size: 14px;\n    border-radius: 3px;\n    -webkit-transition: .3s ease all;\n    transition: .3s ease all;\n}"); }

var Layout$2 = p("div")(css$3);

function SelectFont(props) {
    return (
        h( Layout$2, { container: true }, 
            props.options.map(function (option, index) { return (
                h( Layout$2, { tag: "label" }, 
                    h( 'input', {
                        type: "radio", onchange: function () { return props.onchange && props.onchange(option, index); }, name: props.name || "select-font" }), 
                    h( 'div', null, 
                        h( 'span', { style: ("font-family:" + option) }, option)
                    )
                )
            ); })
        )
    );
}

function css$4 (props){ return ("." + (props.cn) + "[container] {\n    width: 100%;\n    padding: .8rem 1rem 0px;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n}\n\n." + (props.cn) + "[title] {\n    font-size: 11px;\n    font-weight: 600;\n    opacity: .5;\n    padding-bottom: .5rem;\n}"); }

var Layout$3 = p("div")(css$4);

function Label(props) {
    return (
        h( Layout$3, { container: true }, 
            h( Layout$3, { title: true }, props.title), 
            h( Layout$3, { content: true }, props.children)
        )
    );
}

function css$5 (props){ return ("." + (props.cn) + " {\n    padding: .8em 1em;\n    font-size: 14px;\n    color: " + (props.primary) + ";\n    background: white;\n    border: none;\n    border-radius: 3px;\n    font-weight: bold;\n    cursor: pointer;\n    -webkit-box-shadow: 0px 0px 12px rgba(255, 255, 255, .35);\n            box-shadow: 0px 0px 12px rgba(255, 255, 255, .35);\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n}\n\n." + (props.cn) + "[square] {\n    width: 50px;\n    height: 50px;\n}\n\n." + (props.cn) + " {\n    margin: 2.5px;\n}"); }

var Button = p("button")(css$5);

function Logo(props) {
    return (
        h( 'svg', {
            xmlns: "http://www.w3.org/2000/svg", width: props.size || "160px", viewBox: "0 0 825 134" }, 
            h( 'path', {
                'fill-rule': "evenodd", fill: props.color || "#4DDAC8", d: "M789.705 54.851c3.469 1.339 6.502 2.677 9.098 4.016 2.596 1.34 5.549 3.231 8.856 5.675 3.307 2.445 6.082 5.036 8.323 7.771 2.241 2.736 4.155 6.141 5.741 10.215 1.585 4.076 2.378 8.442 2.378 13.097 0 4.657-.953 9.288-2.858 13.89a40.738 40.738 0 0 1-7.944 12.347c-3.39 3.628-7.692 6.554-12.904 8.779-5.212 2.225-10.872 3.338-16.979 3.338-5.545 0-10.778-.516-15.696-1.544-4.92-1.029-9.065-2.377-12.433-4.043-3.37-1.665-6.068-3.195-8.095-4.587-2.028-1.393-3.697-2.754-5.008-4.088-.954-.968-1.506-1.739-1.655-2.315-.149-.576.104-1.561.759-2.953l8.567-15.442c.655-1.09 1.725-1.679 3.214-1.765 1.488-.087 2.499.131 3.035.654l1.339.786c.892.583 1.905 1.223 3.039 1.921 1.135.699 2.583 1.484 4.345 2.357a65.99 65.99 0 0 0 5.33 2.358c1.79.699 3.761 1.281 5.911 1.746 2.149.466 4.18.698 6.091.698 3.712 0 6.752-1.004 9.119-3.011 2.365-2.008 3.548-4.585 3.548-7.729 0-7.217-6.32-13.242-18.957-18.074a101.35 101.35 0 0 1-9.808-4.365c-3.065-1.571-6.219-3.565-9.463-5.981-3.244-2.416-6.011-4.991-8.302-7.727-2.292-2.736-4.181-5.967-5.67-9.693-1.488-3.724-2.231-7.654-2.231-11.787 0-4.766.909-9.334 2.728-13.702 1.818-4.369 4.426-8.326 7.825-11.87 3.399-3.544 7.84-6.385 13.325-8.524 5.485-2.139 11.626-3.209 18.424-3.209 12.874 0 25.186 4.702 36.936 14.105.956.551 1.489 1.544 1.598 2.978.109 1.435-.056 2.427-.493 2.977l-8.61 14.471c-.601 1.101-1.503 1.925-2.706 2.475-1.203.549-2.187.532-2.95-.051-.056-.057-.757-.536-2.106-1.44a83 83 0 0 0-4.432-2.75 114.283 114.283 0 0 0-5.508-2.968 36.962 36.962 0 0 0-6.627-2.576c-2.353-.669-4.533-1.004-6.54-1.004-3.234 0-5.974.917-8.221 2.751-2.246 1.835-3.368 3.974-3.368 6.417 0 3.377 1.541 6.404 4.627 9.081 3.085 2.677 8.221 5.443 15.408 8.295zm-76.146 77.338h-21.886c-.89 0-1.692-.358-2.404-1.074-.712-.715-1.067-1.521-1.067-2.415V7.369c0-.894.355-1.7 1.067-2.415.712-.716 1.514-1.074 2.404-1.074h21.886c.889 0 1.689.358 2.402 1.074.711.715 1.068 1.521 1.068 2.415V128.7c0 .894-.357 1.7-1.068 2.415-.713.716-1.513 1.074-2.402 1.074zm-60.361 0h-21.844c-1.016 0-1.851-.342-2.507-1.029a3.43 3.43 0 0 1-.985-2.46V80.472H575.49V128.7c0 .954-.329 1.775-.985 2.46-.657.687-1.492 1.029-2.506 1.029h-21.844c-.896 0-1.701-.358-2.418-1.074-.716-.715-1.074-1.521-1.074-2.415V7.369c0-.894.358-1.7 1.074-2.415.717-.716 1.522-1.074 2.418-1.074h21.844c1.014 0 1.849.344 2.506 1.029.656.686.985 1.507.985 2.46v46.17h52.372V7.369c0-.953.328-1.774.985-2.46.656-.685 1.491-1.029 2.507-1.029h21.844c.895 0 1.701.358 2.417 1.074.716.715 1.074 1.521 1.074 2.415V128.7c0 .894-.358 1.7-1.074 2.415-.716.716-1.522 1.074-2.417 1.074zM524.888 30.812h-26.389V128.7c0 .894-.357 1.7-1.069 2.415-.712.716-1.512 1.074-2.402 1.074h-21.886c-.89 0-1.691-.358-2.403-1.074-.712-.715-1.067-1.521-1.067-2.415V30.812h-26.3c-1.021 0-1.862-.342-2.522-1.029-.66-.685-.99-1.476-.99-2.371V7.369c0-.953.328-1.774.986-2.46.657-.685 1.495-1.029 2.512-1.029h81.544c1.015 0 1.853.344 2.51 1.029.658.686.988 1.507.988 2.46v20.043c0 .895-.33 1.686-.99 2.371-.661.687-1.501 1.029-2.522 1.029zM386.039 131.938h-.02c-10.12 0-18.324-8.204-18.324-18.324 0-10.121 8.204-18.325 18.324-18.325h.02c11.514 0 18.325 9.656 18.325 18.325 0 10.12-8.204 18.324-18.325 18.324zm12.335-92.732l-.029.026-.184.16a18.245 18.245 0 0 1-11.334 4.568c-.264.013-.527.019-.788.019h-.02c-10.12 0-18.324-8.204-18.324-18.324 0-10.121 8.204-18.325 18.324-18.325h.02c10.121 0 18.325 8.204 18.325 18.325 0 .324-.009.647-.026.968-.255 5.457-2.658 9.673-5.964 12.583zm-78.307 80.66c-3.423 3.629-7.766 6.555-13.028 8.782-5.262 2.224-10.975 3.337-17.141 3.337-5.598 0-10.881-.516-15.847-1.543-4.966-1.029-9.151-2.377-12.551-4.044-3.402-1.666-6.126-3.196-8.173-4.588-2.047-1.393-3.732-2.755-5.055-4.089-.964-.968-1.521-1.74-1.671-2.316-.151-.576.104-1.56.765-2.953l8.65-15.445c.661-1.091 1.741-1.679 3.244-1.766 1.503-.087 2.524.132 3.064.654l1.352.786c.901.583 1.923 1.224 3.069 1.922 1.145.699 2.607 1.485 4.386 2.357a66.65 66.65 0 0 0 5.381 2.359c1.807.699 3.797 1.281 5.968 1.747 2.169.466 4.219.698 6.148.698 3.748 0 6.817-1.004 9.207-3.012 2.388-2.008 3.582-4.586 3.582-7.73 0-7.219-6.38-13.246-19.138-18.078a102.7 102.7 0 0 1-9.902-4.366c-3.095-1.572-6.279-3.566-9.554-5.982-3.275-2.416-6.068-4.992-8.381-7.729-2.314-2.736-4.222-5.968-5.724-9.695-1.503-3.725-2.253-7.656-2.253-11.789 0-4.767.918-9.335 2.754-13.705 1.836-4.37 4.468-8.327 7.9-11.872 3.432-3.545 7.916-6.386 13.453-8.526 5.537-2.139 11.737-3.209 18.6-3.209 12.997 0 25.427 4.702 37.29 14.108.964.551 1.502 1.544 1.612 2.978.11 1.435-.056 2.428-.497 2.977l-8.692 14.475c-.607 1.1-1.518 1.925-2.733 2.475-1.214.549-2.207.533-2.978-.051-.056-.057-.764-.537-2.125-1.44a82.506 82.506 0 0 0-4.476-2.75 114.471 114.471 0 0 0-5.56-2.969 37.398 37.398 0 0 0-6.691-2.577c-2.375-.669-4.575-1.004-6.602-1.004-3.265 0-6.031.917-8.299 2.752-2.268 1.834-3.401 3.974-3.401 6.418 0 3.377 1.556 6.404 4.672 9.082 3.114 2.678 8.299 5.444 15.555 8.297 3.503 1.339 6.564 2.678 9.185 4.017 2.621 1.34 5.602 3.232 8.941 5.676 3.338 2.446 6.14 5.037 8.403 7.772 2.262 2.737 4.194 6.143 5.795 10.218 1.6 4.076 2.401 8.443 2.401 13.1s-.962 9.289-2.885 13.892a40.697 40.697 0 0 1-8.02 12.349zm-110.663 0c-3.423 3.629-7.766 6.555-13.028 8.782-5.262 2.224-10.976 3.337-17.141 3.337-5.598 0-10.881-.516-15.847-1.543-4.967-1.029-9.151-2.377-12.552-4.044-3.402-1.666-6.126-3.196-8.172-4.588-2.048-1.393-3.732-2.755-5.056-4.089-.963-.968-1.521-1.74-1.67-2.316-.151-.576.104-1.56.765-2.953l8.65-15.445c.661-1.091 1.741-1.679 3.244-1.766 1.502-.087 2.523.132 3.064.654l1.352.786c.901.583 1.923 1.224 3.068 1.922 1.146.699 2.607 1.485 4.387 2.357a66.63 66.63 0 0 0 5.38 2.359c1.808.699 3.798 1.281 5.968 1.747 2.169.466 4.22.698 6.149.698 3.748 0 6.817-1.004 9.206-3.012 2.388-2.008 3.583-4.586 3.583-7.73 0-7.219-6.38-13.246-19.138-18.078a102.83 102.83 0 0 1-9.903-4.366c-3.094-1.572-6.278-3.566-9.553-5.982-3.275-2.416-6.069-4.992-8.382-7.729-2.313-2.736-4.221-5.968-5.723-9.695-1.503-3.725-2.253-7.656-2.253-11.789 0-4.767.918-9.335 2.754-13.705 1.836-4.37 4.468-8.327 7.9-11.872 3.431-3.545 7.915-6.386 13.453-8.526 5.537-2.139 11.736-3.209 18.6-3.209 12.996 0 25.427 4.702 37.289 14.108.965.551 1.503 1.544 1.613 2.978.11 1.435-.056 2.428-.497 2.977l-8.692 14.475c-.608 1.1-1.518 1.925-2.733 2.475-1.214.549-2.207.533-2.978-.051-.057-.057-.764-.537-2.126-1.44a82.462 82.462 0 0 0-4.475-2.75 114.471 114.471 0 0 0-5.56-2.969 37.456 37.456 0 0 0-6.691-2.577c-2.375-.669-4.575-1.004-6.602-1.004-3.265 0-6.032.917-8.3 2.752-2.268 1.834-3.4 3.974-3.4 6.418 0 3.377 1.556 6.404 4.671 9.082 3.114 2.678 8.3 5.444 15.556 8.297 3.502 1.339 6.564 2.678 9.185 4.017 2.621 1.34 5.602 3.232 8.941 5.676 3.338 2.446 6.14 5.037 8.402 7.772 2.263 2.737 4.195 6.143 5.796 10.218 1.6 4.076 2.401 8.443 2.401 13.1s-.962 9.289-2.885 13.892a40.715 40.715 0 0 1-8.02 12.349zM66.895 102.721c4.398 0 8.812-.783 13.241-2.349 4.429-1.567 8.3-3.765 11.614-6.596.602-.542 1.415-.782 2.44-.722 1.024.06 1.808.39 2.35.989l14.461 15.289c.602.6.904 1.379.904 2.338 0 1.074-.361 1.94-1.084 2.596-12.292 11.813-27.296 17.719-45.01 17.719-6.087 0-12.021-.78-17.806-2.339-5.784-1.559-11.059-3.748-15.823-6.567a59.7 59.7 0 0 1-12.922-10.301 64.931 64.931 0 0 1-9.809-13.36c-2.689-4.858-4.785-10.152-6.285-15.88C1.666 77.811.917 71.917.917 65.859c0-8.961 1.655-17.507 4.968-25.639 3.311-8.13 7.756-15.119 13.332-20.964C24.794 13.411 31.679 8.752 39.872 5.28 48.066 1.808 56.712.071 65.811.071c9.097 0 17.247 1.387 24.448 4.161 7.199 2.775 13.993 7.056 20.381 12.843.782.716 1.204 1.611 1.265 2.685 0 .955-.361 1.789-1.084 2.505L96.36 37.121a3.394 3.394 0 0 1-2.35.895c-.904 0-1.658-.318-2.26-.957-7.05-6.7-15.396-10.05-25.036-10.05-10.303 0-18.92 3.735-25.849 11.203-6.929 7.47-10.394 16.445-10.394 26.924 0 10.36 3.494 19.215 10.485 26.563 6.989 7.348 15.636 11.022 25.939 11.022z" })
        )
    );
}

function Gear(props) {
    return (
        h( 'svg', {
            xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 21.589 21.589", width: props.size }, 
            h( 'path', {
                d: "M18.622 8.371l-.545-1.295s1.268-2.861 1.156-2.971l-1.679-1.639c-.116-.113-2.978 1.193-2.978 1.193l-1.32-.533S12.09.226 11.93.226H9.561c-.165 0-1.244 2.906-1.244 2.906l-1.318.535S4.077 2.425 3.965 2.536L2.289 4.177c-.116.113 1.218 2.916 1.218 2.916l-.545 1.293S0 9.527 0 9.681v2.322c0 .162 2.969 1.219 2.969 1.219l.545 1.291s-1.268 2.859-1.157 2.969l1.678 1.643c.114.111 2.977-1.195 2.977-1.195l1.321.535s1.166 2.898 1.327 2.898h2.369c.164 0 1.244-2.906 1.244-2.906l1.322-.535s2.916 1.242 3.029 1.133l1.678-1.641c.117-.115-1.22-2.916-1.22-2.916l.544-1.293s2.963-1.143 2.963-1.299v-2.32c.001-.161-2.967-1.215-2.967-1.215zm-4.366 2.423c0 1.867-1.553 3.387-3.461 3.387-1.906 0-3.461-1.52-3.461-3.387s1.555-3.385 3.461-3.385c1.909.001 3.461 1.518 3.461 3.385z", fill: props.color })
        )
    );
}

var Layout$4 = p("div")(css);

var defaultExport = (function (Component$$1) {
    function defaultExport() {
        Component$$1.call(this);
        this.state = {
            colors: [
                "black",
                "#ED6D15",
                "#EAA711",
                "mediumaquamarine",
                "cornflowerblue"
            ],
            color: "black",
            fontTitle: "Montserrat",
            fontContent: "Montserrat",
            fonts: [
                "Montserrat",
                "Knewave",
                "Indie Flower",
                "Monoton",
                "Nixie One"
            ]
        };
    }

    if ( Component$$1 ) defaultExport.__proto__ = Component$$1;
    defaultExport.prototype = Object.create( Component$$1 && Component$$1.prototype );
    defaultExport.prototype.constructor = defaultExport;
    defaultExport.prototype.render = function render$$1 (props, state) {
        var this$1 = this;

        return (
            h( i, {
                primary: state.color, fontTitle: state.fontTitle, fontContent: state.fontContent }, 
                h( Layout$4, { container: true }, 
                    h( Layout$4, { aside: true, 'aside-hide': state.asideToggle }, 
                        h( Layout$4, {
                            'aside-toggle': true, onclick: function () { return this$1.setState({
                                    asideToggle: !state.asideToggle
                                }); } }, 
                            h( Gear, { size: "18px", color: state.color })
                        ), 
                        h( Layout$4, { 'aside-scroll': true }, 
                            h( Label, { title: "THEME" }), 
                            h( Label, { title: "background color" }, 
                                h( SelectColor, {
                                    options: state.colors, onchange: function (color) { return this$1.setState({ color: color }); } })
                            ), 
                            h( Label, { title: "Font title" }, 
                                h( SelectFont, {
                                    options: state.fonts, name: "font-title", onchange: function (fontTitle) { return this$1.setState({ fontTitle: fontTitle }); } })
                            ), 
                            h( Label, { title: "Font content" }, 
                                h( SelectFont, {
                                    options: state.fonts, name: "font-content", onchange: function (fontContent) { return this$1.setState({ fontContent: fontContent }); } })
                            )
                        )
                    ), 
                    h( Layout$4, { content: true }, 
                        h( Hero, {
                            title: h( 'div', null, 
                                    h( Logo, { color: "white" }), ", ", h( 'br', null ), 
                                    h( 'span', null, "Create amazing styles for your components without stopping using css" )
                                ), content: h( 'div', null, 
                                    h( 'span', null, "What you see is an example using ", h( 'a', { href: "https://rollupjs.org" }, "Rollup,"), 
                                        h( 'a', { href: "https://github.com/uppercod/cssthis" }, "Cssthis"), "and ", h( 'a', { href: "https://preactjs.com" }, "Preact"), ". The result is extremely light, fast and customizable" ), 
                                    h( 'br', null ), 
                                    h( 'br', null ), 
                                    h( 'a', { href: "https://github.com/uppercod/cssthis" }, 
                                        h( Button, null, "Github cssthis" )
                                    ), 
                                    h( 'a', { href: "https://github.com/UpperCod/cssthis-demo/tree/gh-pages" }, 
                                        h( Button, null, "Github this code" )
                                    )
                                ) })
                    )
                )
            )
        );
    };

    return defaultExport;
}(Component));

render(h( defaultExport, null ), document.body);
//# sourceMappingURL=index.js.map
