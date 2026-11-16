#!/usr/bin/env node
import { createRequire as __mfmapCreateRequire } from 'node:module';
import { fileURLToPath as __mfmapFileURLToPath } from 'node:url';
import { dirname as __mfmapDirname } from 'node:path';
const require = __mfmapCreateRequire(import.meta.url);
const __filename = __mfmapFileURLToPath(import.meta.url);
const __dirname = __mfmapDirname(__filename);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/web-tree-sitter/tree-sitter.js
var require_tree_sitter = __commonJS({
  "node_modules/web-tree-sitter/tree-sitter.js"(exports, module) {
    var Module = void 0 !== Module ? Module : {};
    var TreeSitter = function() {
      var initPromise, document = "object" == typeof window ? { currentScript: window.document.currentScript } : null;
      class Parser {
        constructor() {
          this.initialize();
        }
        initialize() {
          throw new Error("cannot construct a Parser before calling `init()`");
        }
        static init(moduleOptions) {
          return initPromise || (Module = Object.assign({}, Module, moduleOptions), initPromise = new Promise((resolveInitPromise) => {
            var moduleOverrides = Object.assign({}, Module), arguments_ = [], thisProgram = "./this.program", quit_ = (e, t) => {
              throw t;
            }, ENVIRONMENT_IS_WEB = "object" == typeof window, ENVIRONMENT_IS_WORKER = "function" == typeof importScripts, ENVIRONMENT_IS_NODE = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, scriptDirectory = "", read_, readAsync, readBinary;
            function locateFile(e) {
              return Module.locateFile ? Module.locateFile(e, scriptDirectory) : scriptDirectory + e;
            }
            if (ENVIRONMENT_IS_NODE) {
              var fs = __require("fs"), nodePath = __require("path");
              scriptDirectory = ENVIRONMENT_IS_WORKER ? nodePath.dirname(scriptDirectory) + "/" : __dirname + "/", read_ = (e, t) => (e = isFileURI(e) ? new URL(e) : nodePath.normalize(e), fs.readFileSync(e, t ? void 0 : "utf8")), readBinary = (e) => {
                var t = read_(e, true);
                return t.buffer || (t = new Uint8Array(t)), t;
              }, readAsync = (e, t, _, s = true) => {
                e = isFileURI(e) ? new URL(e) : nodePath.normalize(e), fs.readFile(e, s ? void 0 : "utf8", (e2, r) => {
                  e2 ? _(e2) : t(s ? r.buffer : r);
                });
              }, !Module.thisProgram && process.argv.length > 1 && (thisProgram = process.argv[1].replace(/\\/g, "/")), arguments_ = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), quit_ = (e, t) => {
                throw process.exitCode = e, t;
              };
            } else (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : void 0 !== document && document.currentScript && (scriptDirectory = document.currentScript.src), scriptDirectory = scriptDirectory.startsWith("blob:") ? "" : scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1), read_ = (e) => {
              var t = new XMLHttpRequest();
              return t.open("GET", e, false), t.send(null), t.responseText;
            }, ENVIRONMENT_IS_WORKER && (readBinary = (e) => {
              var t = new XMLHttpRequest();
              return t.open("GET", e, false), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
            }), readAsync = (e, t, _) => {
              var s = new XMLHttpRequest();
              s.open("GET", e, true), s.responseType = "arraybuffer", s.onload = () => {
                200 == s.status || 0 == s.status && s.response ? t(s.response) : _();
              }, s.onerror = _, s.send(null);
            });
            var out = Module.print || console.log.bind(console), err = Module.printErr || console.error.bind(console);
            Object.assign(Module, moduleOverrides), moduleOverrides = null, Module.arguments && (arguments_ = Module.arguments), Module.thisProgram && (thisProgram = Module.thisProgram), Module.quit && (quit_ = Module.quit);
            var dynamicLibraries = Module.dynamicLibraries || [], wasmBinary, wasmMemory;
            Module.wasmBinary && (wasmBinary = Module.wasmBinary), "object" != typeof WebAssembly && abort("no native wasm support detected");
            var ABORT = false, EXITSTATUS, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
            function updateMemoryViews() {
              var e = wasmMemory.buffer;
              Module.HEAP8 = HEAP8 = new Int8Array(e), Module.HEAP16 = HEAP16 = new Int16Array(e), Module.HEAPU8 = HEAPU8 = new Uint8Array(e), Module.HEAPU16 = HEAPU16 = new Uint16Array(e), Module.HEAP32 = HEAP32 = new Int32Array(e), Module.HEAPU32 = HEAPU32 = new Uint32Array(e), Module.HEAPF32 = HEAPF32 = new Float32Array(e), Module.HEAPF64 = HEAPF64 = new Float64Array(e);
            }
            var INITIAL_MEMORY = Module.INITIAL_MEMORY || 33554432;
            wasmMemory = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({ initial: INITIAL_MEMORY / 65536, maximum: 32768 }), updateMemoryViews(), INITIAL_MEMORY = wasmMemory.buffer.byteLength;
            var __ATPRERUN__ = [], __ATINIT__ = [], __ATMAIN__ = [], __ATPOSTRUN__ = [], __RELOC_FUNCS__ = [], runtimeInitialized = false;
            function preRun() {
              if (Module.preRun) for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length; ) addOnPreRun(Module.preRun.shift());
              callRuntimeCallbacks(__ATPRERUN__);
            }
            function initRuntime() {
              runtimeInitialized = true, callRuntimeCallbacks(__RELOC_FUNCS__), callRuntimeCallbacks(__ATINIT__);
            }
            function preMain() {
              callRuntimeCallbacks(__ATMAIN__);
            }
            function postRun() {
              if (Module.postRun) for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length; ) addOnPostRun(Module.postRun.shift());
              callRuntimeCallbacks(__ATPOSTRUN__);
            }
            function addOnPreRun(e) {
              __ATPRERUN__.unshift(e);
            }
            function addOnInit(e) {
              __ATINIT__.unshift(e);
            }
            function addOnPostRun(e) {
              __ATPOSTRUN__.unshift(e);
            }
            var runDependencies = 0, runDependencyWatcher = null, dependenciesFulfilled = null;
            function getUniqueRunDependency(e) {
              return e;
            }
            function addRunDependency(e) {
              runDependencies++, Module.monitorRunDependencies?.(runDependencies);
            }
            function removeRunDependency(e) {
              if (runDependencies--, Module.monitorRunDependencies?.(runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
                var t = dependenciesFulfilled;
                dependenciesFulfilled = null, t();
              }
            }
            function abort(e) {
              throw Module.onAbort?.(e), err(e = "Aborted(" + e + ")"), ABORT = true, EXITSTATUS = 1, e += ". Build with -sASSERTIONS for more info.", new WebAssembly.RuntimeError(e);
            }
            var dataURIPrefix = "data:application/octet-stream;base64,", isDataURI = (e) => e.startsWith(dataURIPrefix), isFileURI = (e) => e.startsWith("file://"), wasmBinaryFile;
            function getBinarySync(e) {
              if (e == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
              if (readBinary) return readBinary(e);
              throw "both async and sync fetching of the wasm failed";
            }
            function getBinaryPromise(e) {
              if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                if ("function" == typeof fetch && !isFileURI(e)) return fetch(e, { credentials: "same-origin" }).then((t) => {
                  if (!t.ok) throw `failed to load wasm binary file at '${e}'`;
                  return t.arrayBuffer();
                }).catch(() => getBinarySync(e));
                if (readAsync) return new Promise((t, _) => {
                  readAsync(e, (e2) => t(new Uint8Array(e2)), _);
                });
              }
              return Promise.resolve().then(() => getBinarySync(e));
            }
            function instantiateArrayBuffer(e, t, _) {
              return getBinaryPromise(e).then((e2) => WebAssembly.instantiate(e2, t)).then(_, (e2) => {
                err(`failed to asynchronously prepare wasm: ${e2}`), abort(e2);
              });
            }
            function instantiateAsync(e, t, _, s) {
              return e || "function" != typeof WebAssembly.instantiateStreaming || isDataURI(t) || isFileURI(t) || ENVIRONMENT_IS_NODE || "function" != typeof fetch ? instantiateArrayBuffer(t, _, s) : fetch(t, { credentials: "same-origin" }).then((e2) => WebAssembly.instantiateStreaming(e2, _).then(s, function(e3) {
                return err(`wasm streaming compile failed: ${e3}`), err("falling back to ArrayBuffer instantiation"), instantiateArrayBuffer(t, _, s);
              }));
            }
            function createWasm() {
              var e = { env: wasmImports, wasi_snapshot_preview1: wasmImports, "GOT.mem": new Proxy(wasmImports, GOTHandler), "GOT.func": new Proxy(wasmImports, GOTHandler) };
              function t(e2, t2) {
                wasmExports = e2.exports, wasmExports = relocateExports(wasmExports, 1024);
                var _ = getDylinkMetadata(t2);
                return _.neededDynlibs && (dynamicLibraries = _.neededDynlibs.concat(dynamicLibraries)), mergeLibSymbols(wasmExports, "main"), LDSO.init(), loadDylibs(), addOnInit(wasmExports.__wasm_call_ctors), __RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs), removeRunDependency("wasm-instantiate"), wasmExports;
              }
              if (addRunDependency("wasm-instantiate"), Module.instantiateWasm) try {
                return Module.instantiateWasm(e, t);
              } catch (e2) {
                return err(`Module.instantiateWasm callback failed with error: ${e2}`), false;
              }
              return instantiateAsync(wasmBinary, wasmBinaryFile, e, function(e2) {
                t(e2.instance, e2.module);
              }), {};
            }
            wasmBinaryFile = "tree-sitter.wasm", isDataURI(wasmBinaryFile) || (wasmBinaryFile = locateFile(wasmBinaryFile));
            var ASM_CONSTS = {};
            function ExitStatus(e) {
              this.name = "ExitStatus", this.message = `Program terminated with exit(${e})`, this.status = e;
            }
            var GOT = {}, currentModuleWeakSymbols = /* @__PURE__ */ new Set([]), GOTHandler = { get(e, t) {
              var _ = GOT[t];
              return _ || (_ = GOT[t] = new WebAssembly.Global({ value: "i32", mutable: true })), currentModuleWeakSymbols.has(t) || (_.required = true), _;
            } }, callRuntimeCallbacks = (e) => {
              for (; e.length > 0; ) e.shift()(Module);
            }, UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, UTF8ArrayToString = (e, t, _) => {
              for (var s = t + _, r = t; e[r] && !(r >= s); ) ++r;
              if (r - t > 16 && e.buffer && UTF8Decoder) return UTF8Decoder.decode(e.subarray(t, r));
              for (var a = ""; t < r; ) {
                var o = e[t++];
                if (128 & o) {
                  var n = 63 & e[t++];
                  if (192 != (224 & o)) {
                    var l = 63 & e[t++];
                    if ((o = 224 == (240 & o) ? (15 & o) << 12 | n << 6 | l : (7 & o) << 18 | n << 12 | l << 6 | 63 & e[t++]) < 65536) a += String.fromCharCode(o);
                    else {
                      var d = o - 65536;
                      a += String.fromCharCode(55296 | d >> 10, 56320 | 1023 & d);
                    }
                  } else a += String.fromCharCode((31 & o) << 6 | n);
                } else a += String.fromCharCode(o);
              }
              return a;
            }, getDylinkMetadata = (e) => {
              var t = 0, _ = 0;
              function s() {
                for (var _2 = 0, s2 = 1; ; ) {
                  var r2 = e[t++];
                  if (_2 += (127 & r2) * s2, s2 *= 128, !(128 & r2)) break;
                }
                return _2;
              }
              function r() {
                var _2 = s();
                return UTF8ArrayToString(e, (t += _2) - _2, _2);
              }
              function a(e2, t2) {
                if (e2) throw new Error(t2);
              }
              var o = "dylink.0";
              if (e instanceof WebAssembly.Module) {
                var n = WebAssembly.Module.customSections(e, o);
                0 === n.length && (o = "dylink", n = WebAssembly.Module.customSections(e, o)), a(0 === n.length, "need dylink section"), _ = (e = new Uint8Array(n[0])).length;
              } else {
                a(!(1836278016 == new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0]), "need to see wasm magic number"), a(0 !== e[8], "need the dylink section to be first"), t = 9;
                var l = s();
                _ = t + l, o = r();
              }
              var d = { neededDynlibs: [], tlsExports: /* @__PURE__ */ new Set(), weakImports: /* @__PURE__ */ new Set() };
              if ("dylink" == o) {
                d.memorySize = s(), d.memoryAlign = s(), d.tableSize = s(), d.tableAlign = s();
                for (var u = s(), m = 0; m < u; ++m) {
                  var c = r();
                  d.neededDynlibs.push(c);
                }
              } else {
                a("dylink.0" !== o);
                for (; t < _; ) {
                  var w = e[t++], p = s();
                  if (1 === w) d.memorySize = s(), d.memoryAlign = s(), d.tableSize = s(), d.tableAlign = s();
                  else if (2 === w) for (u = s(), m = 0; m < u; ++m) c = r(), d.neededDynlibs.push(c);
                  else if (3 === w) for (var h = s(); h--; ) {
                    var g = r();
                    256 & s() && d.tlsExports.add(g);
                  }
                  else if (4 === w) for (h = s(); h--; ) {
                    r(), g = r();
                    1 == (3 & s()) && d.weakImports.add(g);
                  }
                  else t += p;
                }
              }
              return d;
            };
            function getValue(e, t = "i8") {
              switch (t.endsWith("*") && (t = "*"), t) {
                case "i1":
                case "i8":
                  return HEAP8[e];
                case "i16":
                  return HEAP16[e >> 1];
                case "i32":
                  return HEAP32[e >> 2];
                case "i64":
                  abort("to do getValue(i64) use WASM_BIGINT");
                case "float":
                  return HEAPF32[e >> 2];
                case "double":
                  return HEAPF64[e >> 3];
                case "*":
                  return HEAPU32[e >> 2];
                default:
                  abort(`invalid type for getValue: ${t}`);
              }
            }
            var newDSO = (e, t, _) => {
              var s = { refcount: 1 / 0, name: e, exports: _, global: true };
              return LDSO.loadedLibsByName[e] = s, null != t && (LDSO.loadedLibsByHandle[t] = s), s;
            }, LDSO = { loadedLibsByName: {}, loadedLibsByHandle: {}, init() {
              newDSO("__main__", 0, wasmImports);
            } }, ___heap_base = 78096, zeroMemory = (e, t) => (HEAPU8.fill(0, e, e + t), e), alignMemory = (e, t) => Math.ceil(e / t) * t, getMemory = (e) => {
              if (runtimeInitialized) return zeroMemory(_malloc(e), e);
              var t = ___heap_base, _ = t + alignMemory(e, 16);
              return ___heap_base = _, GOT.__heap_base.value = _, t;
            }, isInternalSym = (e) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(e) || e.startsWith("__em_js__"), uleb128Encode = (e, t) => {
              e < 128 ? t.push(e) : t.push(e % 128 | 128, e >> 7);
            }, sigToWasmTypes = (e) => {
              for (var t = { i: "i32", j: "i64", f: "f32", d: "f64", e: "externref", p: "i32" }, _ = { parameters: [], results: "v" == e[0] ? [] : [t[e[0]]] }, s = 1; s < e.length; ++s) _.parameters.push(t[e[s]]);
              return _;
            }, generateFuncType = (e, t) => {
              var _ = e.slice(0, 1), s = e.slice(1), r = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 };
              t.push(96), uleb128Encode(s.length, t);
              for (var a = 0; a < s.length; ++a) t.push(r[s[a]]);
              "v" == _ ? t.push(0) : t.push(1, r[_]);
            }, convertJsFunctionToWasm = (e, t) => {
              if ("function" == typeof WebAssembly.Function) return new WebAssembly.Function(sigToWasmTypes(t), e);
              var _ = [1];
              generateFuncType(t, _);
              var s = [0, 97, 115, 109, 1, 0, 0, 0, 1];
              uleb128Encode(_.length, s), s.push(..._), s.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
              var r = new WebAssembly.Module(new Uint8Array(s));
              return new WebAssembly.Instance(r, { e: { f: e } }).exports.f;
            }, wasmTableMirror = [], wasmTable = new WebAssembly.Table({ initial: 27, element: "anyfunc" }), getWasmTableEntry = (e) => {
              var t = wasmTableMirror[e];
              return t || (e >= wasmTableMirror.length && (wasmTableMirror.length = e + 1), wasmTableMirror[e] = t = wasmTable.get(e)), t;
            }, updateTableMap = (e, t) => {
              if (functionsInTableMap) for (var _ = e; _ < e + t; _++) {
                var s = getWasmTableEntry(_);
                s && functionsInTableMap.set(s, _);
              }
            }, functionsInTableMap, getFunctionAddress = (e) => (functionsInTableMap || (functionsInTableMap = /* @__PURE__ */ new WeakMap(), updateTableMap(0, wasmTable.length)), functionsInTableMap.get(e) || 0), freeTableIndexes = [], getEmptyTableSlot = () => {
              if (freeTableIndexes.length) return freeTableIndexes.pop();
              try {
                wasmTable.grow(1);
              } catch (e) {
                if (!(e instanceof RangeError)) throw e;
                throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
              }
              return wasmTable.length - 1;
            }, setWasmTableEntry = (e, t) => {
              wasmTable.set(e, t), wasmTableMirror[e] = wasmTable.get(e);
            }, addFunction = (e, t) => {
              var _ = getFunctionAddress(e);
              if (_) return _;
              var s = getEmptyTableSlot();
              try {
                setWasmTableEntry(s, e);
              } catch (_2) {
                if (!(_2 instanceof TypeError)) throw _2;
                var r = convertJsFunctionToWasm(e, t);
                setWasmTableEntry(s, r);
              }
              return functionsInTableMap.set(e, s), s;
            }, updateGOT = (e, t) => {
              for (var _ in e) if (!isInternalSym(_)) {
                var s = e[_];
                _.startsWith("orig$") && (_ = _.split("$")[1], t = true), GOT[_] ||= new WebAssembly.Global({ value: "i32", mutable: true }), (t || 0 == GOT[_].value) && ("function" == typeof s ? GOT[_].value = addFunction(s) : "number" == typeof s ? GOT[_].value = s : err(`unhandled export type for '${_}': ${typeof s}`));
              }
            }, relocateExports = (e, t, _) => {
              var s = {};
              for (var r in e) {
                var a = e[r];
                "object" == typeof a && (a = a.value), "number" == typeof a && (a += t), s[r] = a;
              }
              return updateGOT(s, _), s;
            }, isSymbolDefined = (e) => {
              var t = wasmImports[e];
              return !(!t || t.stub);
            }, dynCallLegacy = (e, t, _) => (0, Module["dynCall_" + e])(t, ..._), dynCall = (e, t, _ = []) => e.includes("j") ? dynCallLegacy(e, t, _) : getWasmTableEntry(t)(..._), createInvokeFunction = (e) => function() {
              var t = stackSave();
              try {
                return dynCall(e, arguments[0], Array.prototype.slice.call(arguments, 1));
              } catch (e2) {
                if (stackRestore(t), e2 !== e2 + 0) throw e2;
                _setThrew(1, 0);
              }
            }, resolveGlobalSymbol = (e, t = false) => {
              var _;
              return t && "orig$" + e in wasmImports && (e = "orig$" + e), isSymbolDefined(e) ? _ = wasmImports[e] : e.startsWith("invoke_") && (_ = wasmImports[e] = createInvokeFunction(e.split("_")[1])), { sym: _, name: e };
            }, UTF8ToString = (e, t) => e ? UTF8ArrayToString(HEAPU8, e, t) : "", loadWebAssemblyModule = (binary, flags, libName, localScope, handle) => {
              var metadata = getDylinkMetadata(binary);
              function loadModule() {
                var firstLoad = !handle || !HEAP8[handle + 8];
                if (firstLoad) {
                  var memAlign = Math.pow(2, metadata.memoryAlign), memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0, tableBase = metadata.tableSize ? wasmTable.length : 0;
                  handle && (HEAP8[handle + 8] = 1, HEAPU32[handle + 12 >> 2] = memoryBase, HEAP32[handle + 16 >> 2] = metadata.memorySize, HEAPU32[handle + 20 >> 2] = tableBase, HEAP32[handle + 24 >> 2] = metadata.tableSize);
                } else memoryBase = HEAPU32[handle + 12 >> 2], tableBase = HEAPU32[handle + 20 >> 2];
                var tableGrowthNeeded = tableBase + metadata.tableSize - wasmTable.length, moduleExports;
                function resolveSymbol(e) {
                  var t = resolveGlobalSymbol(e).sym;
                  return !t && localScope && (t = localScope[e]), t || (t = moduleExports[e]), t;
                }
                tableGrowthNeeded > 0 && wasmTable.grow(tableGrowthNeeded);
                var proxyHandler = { get(e, t) {
                  switch (t) {
                    case "__memory_base":
                      return memoryBase;
                    case "__table_base":
                      return tableBase;
                  }
                  if (t in wasmImports && !wasmImports[t].stub) return wasmImports[t];
                  var _;
                  t in e || (e[t] = (...e2) => (_ ||= resolveSymbol(t), _(...e2)));
                  return e[t];
                } }, proxy = new Proxy({}, proxyHandler), info = { "GOT.mem": new Proxy({}, GOTHandler), "GOT.func": new Proxy({}, GOTHandler), env: proxy, wasi_snapshot_preview1: proxy };
                function postInstantiation(module, instance) {
                  function addEmAsm(addr, body) {
                    for (var args = [], arity = 0; arity < 16 && -1 != body.indexOf("$" + arity); arity++) args.push("$" + arity);
                    args = args.join(",");
                    var func = `(${args}) => { ${body} };`;
                    ASM_CONSTS[start] = eval(func);
                  }
                  if (updateTableMap(tableBase, metadata.tableSize), moduleExports = relocateExports(instance.exports, memoryBase), flags.allowUndefined || reportUndefinedSymbols(), "__start_em_asm" in moduleExports) for (var start = moduleExports.__start_em_asm, stop = moduleExports.__stop_em_asm; start < stop; ) {
                    var jsString = UTF8ToString(start);
                    addEmAsm(start, jsString), start = HEAPU8.indexOf(0, start) + 1;
                  }
                  function addEmJs(name, cSig, body) {
                    var jsArgs = [];
                    if (cSig = cSig.slice(1, -1), "void" != cSig) for (var i in cSig = cSig.split(","), cSig) {
                      var jsArg = cSig[i].split(" ").pop();
                      jsArgs.push(jsArg.replace("*", ""));
                    }
                    var func = `(${jsArgs}) => ${body};`;
                    moduleExports[name] = eval(func);
                  }
                  for (var name in moduleExports) if (name.startsWith("__em_js__")) {
                    var start = moduleExports[name], jsString = UTF8ToString(start), parts = jsString.split("<::>");
                    addEmJs(name.replace("__em_js__", ""), parts[0], parts[1]), delete moduleExports[name];
                  }
                  var applyRelocs = moduleExports.__wasm_apply_data_relocs;
                  applyRelocs && (runtimeInitialized ? applyRelocs() : __RELOC_FUNCS__.push(applyRelocs));
                  var init = moduleExports.__wasm_call_ctors;
                  return init && (runtimeInitialized ? init() : __ATINIT__.push(init)), moduleExports;
                }
                if (flags.loadAsync) {
                  if (binary instanceof WebAssembly.Module) {
                    var instance = new WebAssembly.Instance(binary, info);
                    return Promise.resolve(postInstantiation(binary, instance));
                  }
                  return WebAssembly.instantiate(binary, info).then((e) => postInstantiation(e.module, e.instance));
                }
                var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary), instance = new WebAssembly.Instance(module, info);
                return postInstantiation(module, instance);
              }
              return currentModuleWeakSymbols = metadata.weakImports, flags.loadAsync ? metadata.neededDynlibs.reduce((e, t) => e.then(() => loadDynamicLibrary(t, flags)), Promise.resolve()).then(loadModule) : (metadata.neededDynlibs.forEach((e) => loadDynamicLibrary(e, flags, localScope)), loadModule());
            }, mergeLibSymbols = (e, t) => {
              for (var [_, s] of Object.entries(e)) {
                const e2 = (e3) => {
                  isSymbolDefined(e3) || (wasmImports[e3] = s);
                };
                e2(_);
                const t2 = "__main_argc_argv";
                "main" == _ && e2(t2), _ == t2 && e2("main"), _.startsWith("dynCall_") && !Module.hasOwnProperty(_) && (Module[_] = s);
              }
            }, asyncLoad = (e, t, _, s) => {
              var r = s ? "" : getUniqueRunDependency(`al ${e}`);
              readAsync(e, (e2) => {
                t(new Uint8Array(e2)), r && removeRunDependency(r);
              }, (t2) => {
                if (!_) throw `Loading data file "${e}" failed.`;
                _();
              }), r && addRunDependency(r);
            };
            function loadDynamicLibrary(e, t = { global: true, nodelete: true }, _, s) {
              var r = LDSO.loadedLibsByName[e];
              if (r) return t.global ? r.global || (r.global = true, mergeLibSymbols(r.exports, e)) : _ && Object.assign(_, r.exports), t.nodelete && r.refcount !== 1 / 0 && (r.refcount = 1 / 0), r.refcount++, s && (LDSO.loadedLibsByHandle[s] = r), !t.loadAsync || Promise.resolve(true);
              function a() {
                if (s) {
                  var _2 = HEAPU32[s + 28 >> 2], r2 = HEAPU32[s + 32 >> 2];
                  if (_2 && r2) {
                    var a2 = HEAP8.slice(_2, _2 + r2);
                    return t.loadAsync ? Promise.resolve(a2) : a2;
                  }
                }
                var o2 = locateFile(e);
                if (t.loadAsync) return new Promise(function(e2, t2) {
                  asyncLoad(o2, e2, t2);
                });
                if (!readBinary) throw new Error(`${o2}: file not found, and synchronous loading of external files is not available`);
                return readBinary(o2);
              }
              function o() {
                return t.loadAsync ? a().then((r2) => loadWebAssemblyModule(r2, t, e, _, s)) : loadWebAssemblyModule(a(), t, e, _, s);
              }
              function n(t2) {
                r.global ? mergeLibSymbols(t2, e) : _ && Object.assign(_, t2), r.exports = t2;
              }
              return (r = newDSO(e, s, "loading")).refcount = t.nodelete ? 1 / 0 : 1, r.global = t.global, t.loadAsync ? o().then((e2) => (n(e2), true)) : (n(o()), true);
            }
            var reportUndefinedSymbols = () => {
              for (var [e, t] of Object.entries(GOT)) if (0 == t.value) {
                var _ = resolveGlobalSymbol(e, true).sym;
                if (!_ && !t.required) continue;
                if ("function" == typeof _) t.value = addFunction(_, _.sig);
                else {
                  if ("number" != typeof _) throw new Error(`bad export type for '${e}': ${typeof _}`);
                  t.value = _;
                }
              }
            }, loadDylibs = () => {
              dynamicLibraries.length ? (addRunDependency("loadDylibs"), dynamicLibraries.reduce((e, t) => e.then(() => loadDynamicLibrary(t, { loadAsync: true, global: true, nodelete: true, allowUndefined: true })), Promise.resolve()).then(() => {
                reportUndefinedSymbols(), removeRunDependency("loadDylibs");
              })) : reportUndefinedSymbols();
            }, noExitRuntime = Module.noExitRuntime || true;
            function setValue(e, t, _ = "i8") {
              switch (_.endsWith("*") && (_ = "*"), _) {
                case "i1":
                case "i8":
                  HEAP8[e] = t;
                  break;
                case "i16":
                  HEAP16[e >> 1] = t;
                  break;
                case "i32":
                  HEAP32[e >> 2] = t;
                  break;
                case "i64":
                  abort("to do setValue(i64) use WASM_BIGINT");
                case "float":
                  HEAPF32[e >> 2] = t;
                  break;
                case "double":
                  HEAPF64[e >> 3] = t;
                  break;
                case "*":
                  HEAPU32[e >> 2] = t;
                  break;
                default:
                  abort(`invalid type for setValue: ${_}`);
              }
            }
            var ___memory_base = new WebAssembly.Global({ value: "i32", mutable: false }, 1024), ___stack_pointer = new WebAssembly.Global({ value: "i32", mutable: true }, 78096), ___table_base = new WebAssembly.Global({ value: "i32", mutable: false }, 1), nowIsMonotonic = 1, __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
            __emscripten_get_now_is_monotonic.sig = "i";
            var _abort = () => {
              abort("");
            };
            _abort.sig = "v";
            var _emscripten_date_now = () => Date.now(), _emscripten_get_now;
            _emscripten_date_now.sig = "d", _emscripten_get_now = () => performance.now(), _emscripten_get_now.sig = "d";
            var _emscripten_memcpy_js = (e, t, _) => HEAPU8.copyWithin(e, t, t + _);
            _emscripten_memcpy_js.sig = "vppp";
            var getHeapMax = () => 2147483648, growMemory = (e) => {
              var t = (e - wasmMemory.buffer.byteLength + 65535) / 65536;
              try {
                return wasmMemory.grow(t), updateMemoryViews(), 1;
              } catch (e2) {
              }
            }, _emscripten_resize_heap = (e) => {
              var t = HEAPU8.length;
              e >>>= 0;
              var _ = getHeapMax();
              if (e > _) return false;
              for (var s, r, a = 1; a <= 4; a *= 2) {
                var o = t * (1 + 0.2 / a);
                o = Math.min(o, e + 100663296);
                var n = Math.min(_, (s = Math.max(e, o)) + ((r = 65536) - s % r) % r);
                if (growMemory(n)) return true;
              }
              return false;
            };
            _emscripten_resize_heap.sig = "ip";
            var _fd_close = (e) => 52;
            _fd_close.sig = "ii";
            var convertI32PairToI53Checked = (e, t) => t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + 4294967296 * t : NaN;
            function _fd_seek(e, t, _, s, r) {
              convertI32PairToI53Checked(t, _);
              return 70;
            }
            _fd_seek.sig = "iiiiip";
            var printCharBuffers = [null, [], []], printChar = (e, t) => {
              var _ = printCharBuffers[e];
              0 === t || 10 === t ? ((1 === e ? out : err)(UTF8ArrayToString(_, 0)), _.length = 0) : _.push(t);
            }, SYSCALLS = { varargs: void 0, get() {
              var e = HEAP32[+SYSCALLS.varargs >> 2];
              return SYSCALLS.varargs += 4, e;
            }, getp: () => SYSCALLS.get(), getStr: (e) => UTF8ToString(e) }, _fd_write = (e, t, _, s) => {
              for (var r = 0, a = 0; a < _; a++) {
                var o = HEAPU32[t >> 2], n = HEAPU32[t + 4 >> 2];
                t += 8;
                for (var l = 0; l < n; l++) printChar(e, HEAPU8[o + l]);
                r += n;
              }
              return HEAPU32[s >> 2] = r, 0;
            };
            function _tree_sitter_log_callback(e, t) {
              if (currentLogCallback) {
                const _ = UTF8ToString(t);
                currentLogCallback(_, 0 !== e);
              }
            }
            function _tree_sitter_parse_callback(e, t, _, s, r) {
              const a = currentParseCallback(t, { row: _, column: s });
              "string" == typeof a ? (setValue(r, a.length, "i32"), stringToUTF16(a, e, 10240)) : setValue(r, 0, "i32");
            }
            _fd_write.sig = "iippp";
            var runtimeKeepaliveCounter = 0, keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0, _proc_exit = (e) => {
              EXITSTATUS = e, keepRuntimeAlive() || (Module.onExit?.(e), ABORT = true), quit_(e, new ExitStatus(e));
            };
            _proc_exit.sig = "vi";
            var exitJS = (e, t) => {
              EXITSTATUS = e, _proc_exit(e);
            }, handleException = (e) => {
              if (e instanceof ExitStatus || "unwind" == e) return EXITSTATUS;
              quit_(1, e);
            }, lengthBytesUTF8 = (e) => {
              for (var t = 0, _ = 0; _ < e.length; ++_) {
                var s = e.charCodeAt(_);
                s <= 127 ? t++ : s <= 2047 ? t += 2 : s >= 55296 && s <= 57343 ? (t += 4, ++_) : t += 3;
              }
              return t;
            }, stringToUTF8Array = (e, t, _, s) => {
              if (!(s > 0)) return 0;
              for (var r = _, a = _ + s - 1, o = 0; o < e.length; ++o) {
                var n = e.charCodeAt(o);
                if (n >= 55296 && n <= 57343) n = 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++o);
                if (n <= 127) {
                  if (_ >= a) break;
                  t[_++] = n;
                } else if (n <= 2047) {
                  if (_ + 1 >= a) break;
                  t[_++] = 192 | n >> 6, t[_++] = 128 | 63 & n;
                } else if (n <= 65535) {
                  if (_ + 2 >= a) break;
                  t[_++] = 224 | n >> 12, t[_++] = 128 | n >> 6 & 63, t[_++] = 128 | 63 & n;
                } else {
                  if (_ + 3 >= a) break;
                  t[_++] = 240 | n >> 18, t[_++] = 128 | n >> 12 & 63, t[_++] = 128 | n >> 6 & 63, t[_++] = 128 | 63 & n;
                }
              }
              return t[_] = 0, _ - r;
            }, stringToUTF8 = (e, t, _) => stringToUTF8Array(e, HEAPU8, t, _), stringToUTF8OnStack = (e) => {
              var t = lengthBytesUTF8(e) + 1, _ = stackAlloc(t);
              return stringToUTF8(e, _, t), _;
            }, stringToUTF16 = (e, t, _) => {
              if (_ ??= 2147483647, _ < 2) return 0;
              for (var s = t, r = (_ -= 2) < 2 * e.length ? _ / 2 : e.length, a = 0; a < r; ++a) {
                var o = e.charCodeAt(a);
                HEAP16[t >> 1] = o, t += 2;
              }
              return HEAP16[t >> 1] = 0, t - s;
            }, AsciiToString = (e) => {
              for (var t = ""; ; ) {
                var _ = HEAPU8[e++];
                if (!_) return t;
                t += String.fromCharCode(_);
              }
            }, wasmImports = { __heap_base: ___heap_base, __indirect_function_table: wasmTable, __memory_base: ___memory_base, __stack_pointer: ___stack_pointer, __table_base: ___table_base, _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic, abort: _abort, emscripten_get_now: _emscripten_get_now, emscripten_memcpy_js: _emscripten_memcpy_js, emscripten_resize_heap: _emscripten_resize_heap, fd_close: _fd_close, fd_seek: _fd_seek, fd_write: _fd_write, memory: wasmMemory, tree_sitter_log_callback: _tree_sitter_log_callback, tree_sitter_parse_callback: _tree_sitter_parse_callback }, wasmExports = createWasm(), ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports.__wasm_call_ctors)(), ___wasm_apply_data_relocs = () => (___wasm_apply_data_relocs = wasmExports.__wasm_apply_data_relocs)(), _malloc = Module._malloc = (e) => (_malloc = Module._malloc = wasmExports.malloc)(e), _calloc = Module._calloc = (e, t) => (_calloc = Module._calloc = wasmExports.calloc)(e, t), _realloc = Module._realloc = (e, t) => (_realloc = Module._realloc = wasmExports.realloc)(e, t), _free = Module._free = (e) => (_free = Module._free = wasmExports.free)(e), _ts_language_symbol_count = Module._ts_language_symbol_count = (e) => (_ts_language_symbol_count = Module._ts_language_symbol_count = wasmExports.ts_language_symbol_count)(e), _ts_language_state_count = Module._ts_language_state_count = (e) => (_ts_language_state_count = Module._ts_language_state_count = wasmExports.ts_language_state_count)(e), _ts_language_version = Module._ts_language_version = (e) => (_ts_language_version = Module._ts_language_version = wasmExports.ts_language_version)(e), _ts_language_field_count = Module._ts_language_field_count = (e) => (_ts_language_field_count = Module._ts_language_field_count = wasmExports.ts_language_field_count)(e), _ts_language_next_state = Module._ts_language_next_state = (e, t, _) => (_ts_language_next_state = Module._ts_language_next_state = wasmExports.ts_language_next_state)(e, t, _), _ts_language_symbol_name = Module._ts_language_symbol_name = (e, t) => (_ts_language_symbol_name = Module._ts_language_symbol_name = wasmExports.ts_language_symbol_name)(e, t), _ts_language_symbol_for_name = Module._ts_language_symbol_for_name = (e, t, _, s) => (_ts_language_symbol_for_name = Module._ts_language_symbol_for_name = wasmExports.ts_language_symbol_for_name)(e, t, _, s), _strncmp = Module._strncmp = (e, t, _) => (_strncmp = Module._strncmp = wasmExports.strncmp)(e, t, _), _ts_language_symbol_type = Module._ts_language_symbol_type = (e, t) => (_ts_language_symbol_type = Module._ts_language_symbol_type = wasmExports.ts_language_symbol_type)(e, t), _ts_language_field_name_for_id = Module._ts_language_field_name_for_id = (e, t) => (_ts_language_field_name_for_id = Module._ts_language_field_name_for_id = wasmExports.ts_language_field_name_for_id)(e, t), _ts_lookahead_iterator_new = Module._ts_lookahead_iterator_new = (e, t) => (_ts_lookahead_iterator_new = Module._ts_lookahead_iterator_new = wasmExports.ts_lookahead_iterator_new)(e, t), _ts_lookahead_iterator_delete = Module._ts_lookahead_iterator_delete = (e) => (_ts_lookahead_iterator_delete = Module._ts_lookahead_iterator_delete = wasmExports.ts_lookahead_iterator_delete)(e), _ts_lookahead_iterator_reset_state = Module._ts_lookahead_iterator_reset_state = (e, t) => (_ts_lookahead_iterator_reset_state = Module._ts_lookahead_iterator_reset_state = wasmExports.ts_lookahead_iterator_reset_state)(e, t), _ts_lookahead_iterator_reset = Module._ts_lookahead_iterator_reset = (e, t, _) => (_ts_lookahead_iterator_reset = Module._ts_lookahead_iterator_reset = wasmExports.ts_lookahead_iterator_reset)(e, t, _), _ts_lookahead_iterator_next = Module._ts_lookahead_iterator_next = (e) => (_ts_lookahead_iterator_next = Module._ts_lookahead_iterator_next = wasmExports.ts_lookahead_iterator_next)(e), _ts_lookahead_iterator_current_symbol = Module._ts_lookahead_iterator_current_symbol = (e) => (_ts_lookahead_iterator_current_symbol = Module._ts_lookahead_iterator_current_symbol = wasmExports.ts_lookahead_iterator_current_symbol)(e), _memset = Module._memset = (e, t, _) => (_memset = Module._memset = wasmExports.memset)(e, t, _), _memcpy = Module._memcpy = (e, t, _) => (_memcpy = Module._memcpy = wasmExports.memcpy)(e, t, _), _ts_parser_delete = Module._ts_parser_delete = (e) => (_ts_parser_delete = Module._ts_parser_delete = wasmExports.ts_parser_delete)(e), _ts_parser_reset = Module._ts_parser_reset = (e) => (_ts_parser_reset = Module._ts_parser_reset = wasmExports.ts_parser_reset)(e), _ts_parser_set_language = Module._ts_parser_set_language = (e, t) => (_ts_parser_set_language = Module._ts_parser_set_language = wasmExports.ts_parser_set_language)(e, t), _ts_parser_timeout_micros = Module._ts_parser_timeout_micros = (e) => (_ts_parser_timeout_micros = Module._ts_parser_timeout_micros = wasmExports.ts_parser_timeout_micros)(e), _ts_parser_set_timeout_micros = Module._ts_parser_set_timeout_micros = (e, t, _) => (_ts_parser_set_timeout_micros = Module._ts_parser_set_timeout_micros = wasmExports.ts_parser_set_timeout_micros)(e, t, _), _ts_parser_set_included_ranges = Module._ts_parser_set_included_ranges = (e, t, _) => (_ts_parser_set_included_ranges = Module._ts_parser_set_included_ranges = wasmExports.ts_parser_set_included_ranges)(e, t, _), _memmove = Module._memmove = (e, t, _) => (_memmove = Module._memmove = wasmExports.memmove)(e, t, _), _memcmp = Module._memcmp = (e, t, _) => (_memcmp = Module._memcmp = wasmExports.memcmp)(e, t, _), _ts_query_new = Module._ts_query_new = (e, t, _, s, r) => (_ts_query_new = Module._ts_query_new = wasmExports.ts_query_new)(e, t, _, s, r), _ts_query_delete = Module._ts_query_delete = (e) => (_ts_query_delete = Module._ts_query_delete = wasmExports.ts_query_delete)(e), _iswspace = Module._iswspace = (e) => (_iswspace = Module._iswspace = wasmExports.iswspace)(e), _iswalnum = Module._iswalnum = (e) => (_iswalnum = Module._iswalnum = wasmExports.iswalnum)(e), _ts_query_pattern_count = Module._ts_query_pattern_count = (e) => (_ts_query_pattern_count = Module._ts_query_pattern_count = wasmExports.ts_query_pattern_count)(e), _ts_query_capture_count = Module._ts_query_capture_count = (e) => (_ts_query_capture_count = Module._ts_query_capture_count = wasmExports.ts_query_capture_count)(e), _ts_query_string_count = Module._ts_query_string_count = (e) => (_ts_query_string_count = Module._ts_query_string_count = wasmExports.ts_query_string_count)(e), _ts_query_capture_name_for_id = Module._ts_query_capture_name_for_id = (e, t, _) => (_ts_query_capture_name_for_id = Module._ts_query_capture_name_for_id = wasmExports.ts_query_capture_name_for_id)(e, t, _), _ts_query_string_value_for_id = Module._ts_query_string_value_for_id = (e, t, _) => (_ts_query_string_value_for_id = Module._ts_query_string_value_for_id = wasmExports.ts_query_string_value_for_id)(e, t, _), _ts_query_predicates_for_pattern = Module._ts_query_predicates_for_pattern = (e, t, _) => (_ts_query_predicates_for_pattern = Module._ts_query_predicates_for_pattern = wasmExports.ts_query_predicates_for_pattern)(e, t, _), _ts_query_disable_capture = Module._ts_query_disable_capture = (e, t, _) => (_ts_query_disable_capture = Module._ts_query_disable_capture = wasmExports.ts_query_disable_capture)(e, t, _), _ts_tree_copy = Module._ts_tree_copy = (e) => (_ts_tree_copy = Module._ts_tree_copy = wasmExports.ts_tree_copy)(e), _ts_tree_delete = Module._ts_tree_delete = (e) => (_ts_tree_delete = Module._ts_tree_delete = wasmExports.ts_tree_delete)(e), _ts_init = Module._ts_init = () => (_ts_init = Module._ts_init = wasmExports.ts_init)(), _ts_parser_new_wasm = Module._ts_parser_new_wasm = () => (_ts_parser_new_wasm = Module._ts_parser_new_wasm = wasmExports.ts_parser_new_wasm)(), _ts_parser_enable_logger_wasm = Module._ts_parser_enable_logger_wasm = (e, t) => (_ts_parser_enable_logger_wasm = Module._ts_parser_enable_logger_wasm = wasmExports.ts_parser_enable_logger_wasm)(e, t), _ts_parser_parse_wasm = Module._ts_parser_parse_wasm = (e, t, _, s, r) => (_ts_parser_parse_wasm = Module._ts_parser_parse_wasm = wasmExports.ts_parser_parse_wasm)(e, t, _, s, r), _ts_parser_included_ranges_wasm = Module._ts_parser_included_ranges_wasm = (e) => (_ts_parser_included_ranges_wasm = Module._ts_parser_included_ranges_wasm = wasmExports.ts_parser_included_ranges_wasm)(e), _ts_language_type_is_named_wasm = Module._ts_language_type_is_named_wasm = (e, t) => (_ts_language_type_is_named_wasm = Module._ts_language_type_is_named_wasm = wasmExports.ts_language_type_is_named_wasm)(e, t), _ts_language_type_is_visible_wasm = Module._ts_language_type_is_visible_wasm = (e, t) => (_ts_language_type_is_visible_wasm = Module._ts_language_type_is_visible_wasm = wasmExports.ts_language_type_is_visible_wasm)(e, t), _ts_tree_root_node_wasm = Module._ts_tree_root_node_wasm = (e) => (_ts_tree_root_node_wasm = Module._ts_tree_root_node_wasm = wasmExports.ts_tree_root_node_wasm)(e), _ts_tree_root_node_with_offset_wasm = Module._ts_tree_root_node_with_offset_wasm = (e) => (_ts_tree_root_node_with_offset_wasm = Module._ts_tree_root_node_with_offset_wasm = wasmExports.ts_tree_root_node_with_offset_wasm)(e), _ts_tree_edit_wasm = Module._ts_tree_edit_wasm = (e) => (_ts_tree_edit_wasm = Module._ts_tree_edit_wasm = wasmExports.ts_tree_edit_wasm)(e), _ts_tree_included_ranges_wasm = Module._ts_tree_included_ranges_wasm = (e) => (_ts_tree_included_ranges_wasm = Module._ts_tree_included_ranges_wasm = wasmExports.ts_tree_included_ranges_wasm)(e), _ts_tree_get_changed_ranges_wasm = Module._ts_tree_get_changed_ranges_wasm = (e, t) => (_ts_tree_get_changed_ranges_wasm = Module._ts_tree_get_changed_ranges_wasm = wasmExports.ts_tree_get_changed_ranges_wasm)(e, t), _ts_tree_cursor_new_wasm = Module._ts_tree_cursor_new_wasm = (e) => (_ts_tree_cursor_new_wasm = Module._ts_tree_cursor_new_wasm = wasmExports.ts_tree_cursor_new_wasm)(e), _ts_tree_cursor_delete_wasm = Module._ts_tree_cursor_delete_wasm = (e) => (_ts_tree_cursor_delete_wasm = Module._ts_tree_cursor_delete_wasm = wasmExports.ts_tree_cursor_delete_wasm)(e), _ts_tree_cursor_reset_wasm = Module._ts_tree_cursor_reset_wasm = (e) => (_ts_tree_cursor_reset_wasm = Module._ts_tree_cursor_reset_wasm = wasmExports.ts_tree_cursor_reset_wasm)(e), _ts_tree_cursor_reset_to_wasm = Module._ts_tree_cursor_reset_to_wasm = (e, t) => (_ts_tree_cursor_reset_to_wasm = Module._ts_tree_cursor_reset_to_wasm = wasmExports.ts_tree_cursor_reset_to_wasm)(e, t), _ts_tree_cursor_goto_first_child_wasm = Module._ts_tree_cursor_goto_first_child_wasm = (e) => (_ts_tree_cursor_goto_first_child_wasm = Module._ts_tree_cursor_goto_first_child_wasm = wasmExports.ts_tree_cursor_goto_first_child_wasm)(e), _ts_tree_cursor_goto_last_child_wasm = Module._ts_tree_cursor_goto_last_child_wasm = (e) => (_ts_tree_cursor_goto_last_child_wasm = Module._ts_tree_cursor_goto_last_child_wasm = wasmExports.ts_tree_cursor_goto_last_child_wasm)(e), _ts_tree_cursor_goto_first_child_for_index_wasm = Module._ts_tree_cursor_goto_first_child_for_index_wasm = (e) => (_ts_tree_cursor_goto_first_child_for_index_wasm = Module._ts_tree_cursor_goto_first_child_for_index_wasm = wasmExports.ts_tree_cursor_goto_first_child_for_index_wasm)(e), _ts_tree_cursor_goto_first_child_for_position_wasm = Module._ts_tree_cursor_goto_first_child_for_position_wasm = (e) => (_ts_tree_cursor_goto_first_child_for_position_wasm = Module._ts_tree_cursor_goto_first_child_for_position_wasm = wasmExports.ts_tree_cursor_goto_first_child_for_position_wasm)(e), _ts_tree_cursor_goto_next_sibling_wasm = Module._ts_tree_cursor_goto_next_sibling_wasm = (e) => (_ts_tree_cursor_goto_next_sibling_wasm = Module._ts_tree_cursor_goto_next_sibling_wasm = wasmExports.ts_tree_cursor_goto_next_sibling_wasm)(e), _ts_tree_cursor_goto_previous_sibling_wasm = Module._ts_tree_cursor_goto_previous_sibling_wasm = (e) => (_ts_tree_cursor_goto_previous_sibling_wasm = Module._ts_tree_cursor_goto_previous_sibling_wasm = wasmExports.ts_tree_cursor_goto_previous_sibling_wasm)(e), _ts_tree_cursor_goto_descendant_wasm = Module._ts_tree_cursor_goto_descendant_wasm = (e, t) => (_ts_tree_cursor_goto_descendant_wasm = Module._ts_tree_cursor_goto_descendant_wasm = wasmExports.ts_tree_cursor_goto_descendant_wasm)(e, t), _ts_tree_cursor_goto_parent_wasm = Module._ts_tree_cursor_goto_parent_wasm = (e) => (_ts_tree_cursor_goto_parent_wasm = Module._ts_tree_cursor_goto_parent_wasm = wasmExports.ts_tree_cursor_goto_parent_wasm)(e), _ts_tree_cursor_current_node_type_id_wasm = Module._ts_tree_cursor_current_node_type_id_wasm = (e) => (_ts_tree_cursor_current_node_type_id_wasm = Module._ts_tree_cursor_current_node_type_id_wasm = wasmExports.ts_tree_cursor_current_node_type_id_wasm)(e), _ts_tree_cursor_current_node_state_id_wasm = Module._ts_tree_cursor_current_node_state_id_wasm = (e) => (_ts_tree_cursor_current_node_state_id_wasm = Module._ts_tree_cursor_current_node_state_id_wasm = wasmExports.ts_tree_cursor_current_node_state_id_wasm)(e), _ts_tree_cursor_current_node_is_named_wasm = Module._ts_tree_cursor_current_node_is_named_wasm = (e) => (_ts_tree_cursor_current_node_is_named_wasm = Module._ts_tree_cursor_current_node_is_named_wasm = wasmExports.ts_tree_cursor_current_node_is_named_wasm)(e), _ts_tree_cursor_current_node_is_missing_wasm = Module._ts_tree_cursor_current_node_is_missing_wasm = (e) => (_ts_tree_cursor_current_node_is_missing_wasm = Module._ts_tree_cursor_current_node_is_missing_wasm = wasmExports.ts_tree_cursor_current_node_is_missing_wasm)(e), _ts_tree_cursor_current_node_id_wasm = Module._ts_tree_cursor_current_node_id_wasm = (e) => (_ts_tree_cursor_current_node_id_wasm = Module._ts_tree_cursor_current_node_id_wasm = wasmExports.ts_tree_cursor_current_node_id_wasm)(e), _ts_tree_cursor_start_position_wasm = Module._ts_tree_cursor_start_position_wasm = (e) => (_ts_tree_cursor_start_position_wasm = Module._ts_tree_cursor_start_position_wasm = wasmExports.ts_tree_cursor_start_position_wasm)(e), _ts_tree_cursor_end_position_wasm = Module._ts_tree_cursor_end_position_wasm = (e) => (_ts_tree_cursor_end_position_wasm = Module._ts_tree_cursor_end_position_wasm = wasmExports.ts_tree_cursor_end_position_wasm)(e), _ts_tree_cursor_start_index_wasm = Module._ts_tree_cursor_start_index_wasm = (e) => (_ts_tree_cursor_start_index_wasm = Module._ts_tree_cursor_start_index_wasm = wasmExports.ts_tree_cursor_start_index_wasm)(e), _ts_tree_cursor_end_index_wasm = Module._ts_tree_cursor_end_index_wasm = (e) => (_ts_tree_cursor_end_index_wasm = Module._ts_tree_cursor_end_index_wasm = wasmExports.ts_tree_cursor_end_index_wasm)(e), _ts_tree_cursor_current_field_id_wasm = Module._ts_tree_cursor_current_field_id_wasm = (e) => (_ts_tree_cursor_current_field_id_wasm = Module._ts_tree_cursor_current_field_id_wasm = wasmExports.ts_tree_cursor_current_field_id_wasm)(e), _ts_tree_cursor_current_depth_wasm = Module._ts_tree_cursor_current_depth_wasm = (e) => (_ts_tree_cursor_current_depth_wasm = Module._ts_tree_cursor_current_depth_wasm = wasmExports.ts_tree_cursor_current_depth_wasm)(e), _ts_tree_cursor_current_descendant_index_wasm = Module._ts_tree_cursor_current_descendant_index_wasm = (e) => (_ts_tree_cursor_current_descendant_index_wasm = Module._ts_tree_cursor_current_descendant_index_wasm = wasmExports.ts_tree_cursor_current_descendant_index_wasm)(e), _ts_tree_cursor_current_node_wasm = Module._ts_tree_cursor_current_node_wasm = (e) => (_ts_tree_cursor_current_node_wasm = Module._ts_tree_cursor_current_node_wasm = wasmExports.ts_tree_cursor_current_node_wasm)(e), _ts_node_symbol_wasm = Module._ts_node_symbol_wasm = (e) => (_ts_node_symbol_wasm = Module._ts_node_symbol_wasm = wasmExports.ts_node_symbol_wasm)(e), _ts_node_field_name_for_child_wasm = Module._ts_node_field_name_for_child_wasm = (e, t) => (_ts_node_field_name_for_child_wasm = Module._ts_node_field_name_for_child_wasm = wasmExports.ts_node_field_name_for_child_wasm)(e, t), _ts_node_children_by_field_id_wasm = Module._ts_node_children_by_field_id_wasm = (e, t) => (_ts_node_children_by_field_id_wasm = Module._ts_node_children_by_field_id_wasm = wasmExports.ts_node_children_by_field_id_wasm)(e, t), _ts_node_first_child_for_byte_wasm = Module._ts_node_first_child_for_byte_wasm = (e) => (_ts_node_first_child_for_byte_wasm = Module._ts_node_first_child_for_byte_wasm = wasmExports.ts_node_first_child_for_byte_wasm)(e), _ts_node_first_named_child_for_byte_wasm = Module._ts_node_first_named_child_for_byte_wasm = (e) => (_ts_node_first_named_child_for_byte_wasm = Module._ts_node_first_named_child_for_byte_wasm = wasmExports.ts_node_first_named_child_for_byte_wasm)(e), _ts_node_grammar_symbol_wasm = Module._ts_node_grammar_symbol_wasm = (e) => (_ts_node_grammar_symbol_wasm = Module._ts_node_grammar_symbol_wasm = wasmExports.ts_node_grammar_symbol_wasm)(e), _ts_node_child_count_wasm = Module._ts_node_child_count_wasm = (e) => (_ts_node_child_count_wasm = Module._ts_node_child_count_wasm = wasmExports.ts_node_child_count_wasm)(e), _ts_node_named_child_count_wasm = Module._ts_node_named_child_count_wasm = (e) => (_ts_node_named_child_count_wasm = Module._ts_node_named_child_count_wasm = wasmExports.ts_node_named_child_count_wasm)(e), _ts_node_child_wasm = Module._ts_node_child_wasm = (e, t) => (_ts_node_child_wasm = Module._ts_node_child_wasm = wasmExports.ts_node_child_wasm)(e, t), _ts_node_named_child_wasm = Module._ts_node_named_child_wasm = (e, t) => (_ts_node_named_child_wasm = Module._ts_node_named_child_wasm = wasmExports.ts_node_named_child_wasm)(e, t), _ts_node_child_by_field_id_wasm = Module._ts_node_child_by_field_id_wasm = (e, t) => (_ts_node_child_by_field_id_wasm = Module._ts_node_child_by_field_id_wasm = wasmExports.ts_node_child_by_field_id_wasm)(e, t), _ts_node_next_sibling_wasm = Module._ts_node_next_sibling_wasm = (e) => (_ts_node_next_sibling_wasm = Module._ts_node_next_sibling_wasm = wasmExports.ts_node_next_sibling_wasm)(e), _ts_node_prev_sibling_wasm = Module._ts_node_prev_sibling_wasm = (e) => (_ts_node_prev_sibling_wasm = Module._ts_node_prev_sibling_wasm = wasmExports.ts_node_prev_sibling_wasm)(e), _ts_node_next_named_sibling_wasm = Module._ts_node_next_named_sibling_wasm = (e) => (_ts_node_next_named_sibling_wasm = Module._ts_node_next_named_sibling_wasm = wasmExports.ts_node_next_named_sibling_wasm)(e), _ts_node_prev_named_sibling_wasm = Module._ts_node_prev_named_sibling_wasm = (e) => (_ts_node_prev_named_sibling_wasm = Module._ts_node_prev_named_sibling_wasm = wasmExports.ts_node_prev_named_sibling_wasm)(e), _ts_node_descendant_count_wasm = Module._ts_node_descendant_count_wasm = (e) => (_ts_node_descendant_count_wasm = Module._ts_node_descendant_count_wasm = wasmExports.ts_node_descendant_count_wasm)(e), _ts_node_parent_wasm = Module._ts_node_parent_wasm = (e) => (_ts_node_parent_wasm = Module._ts_node_parent_wasm = wasmExports.ts_node_parent_wasm)(e), _ts_node_descendant_for_index_wasm = Module._ts_node_descendant_for_index_wasm = (e) => (_ts_node_descendant_for_index_wasm = Module._ts_node_descendant_for_index_wasm = wasmExports.ts_node_descendant_for_index_wasm)(e), _ts_node_named_descendant_for_index_wasm = Module._ts_node_named_descendant_for_index_wasm = (e) => (_ts_node_named_descendant_for_index_wasm = Module._ts_node_named_descendant_for_index_wasm = wasmExports.ts_node_named_descendant_for_index_wasm)(e), _ts_node_descendant_for_position_wasm = Module._ts_node_descendant_for_position_wasm = (e) => (_ts_node_descendant_for_position_wasm = Module._ts_node_descendant_for_position_wasm = wasmExports.ts_node_descendant_for_position_wasm)(e), _ts_node_named_descendant_for_position_wasm = Module._ts_node_named_descendant_for_position_wasm = (e) => (_ts_node_named_descendant_for_position_wasm = Module._ts_node_named_descendant_for_position_wasm = wasmExports.ts_node_named_descendant_for_position_wasm)(e), _ts_node_start_point_wasm = Module._ts_node_start_point_wasm = (e) => (_ts_node_start_point_wasm = Module._ts_node_start_point_wasm = wasmExports.ts_node_start_point_wasm)(e), _ts_node_end_point_wasm = Module._ts_node_end_point_wasm = (e) => (_ts_node_end_point_wasm = Module._ts_node_end_point_wasm = wasmExports.ts_node_end_point_wasm)(e), _ts_node_start_index_wasm = Module._ts_node_start_index_wasm = (e) => (_ts_node_start_index_wasm = Module._ts_node_start_index_wasm = wasmExports.ts_node_start_index_wasm)(e), _ts_node_end_index_wasm = Module._ts_node_end_index_wasm = (e) => (_ts_node_end_index_wasm = Module._ts_node_end_index_wasm = wasmExports.ts_node_end_index_wasm)(e), _ts_node_to_string_wasm = Module._ts_node_to_string_wasm = (e) => (_ts_node_to_string_wasm = Module._ts_node_to_string_wasm = wasmExports.ts_node_to_string_wasm)(e), _ts_node_children_wasm = Module._ts_node_children_wasm = (e) => (_ts_node_children_wasm = Module._ts_node_children_wasm = wasmExports.ts_node_children_wasm)(e), _ts_node_named_children_wasm = Module._ts_node_named_children_wasm = (e) => (_ts_node_named_children_wasm = Module._ts_node_named_children_wasm = wasmExports.ts_node_named_children_wasm)(e), _ts_node_descendants_of_type_wasm = Module._ts_node_descendants_of_type_wasm = (e, t, _, s, r, a, o) => (_ts_node_descendants_of_type_wasm = Module._ts_node_descendants_of_type_wasm = wasmExports.ts_node_descendants_of_type_wasm)(e, t, _, s, r, a, o), _ts_node_is_named_wasm = Module._ts_node_is_named_wasm = (e) => (_ts_node_is_named_wasm = Module._ts_node_is_named_wasm = wasmExports.ts_node_is_named_wasm)(e), _ts_node_has_changes_wasm = Module._ts_node_has_changes_wasm = (e) => (_ts_node_has_changes_wasm = Module._ts_node_has_changes_wasm = wasmExports.ts_node_has_changes_wasm)(e), _ts_node_has_error_wasm = Module._ts_node_has_error_wasm = (e) => (_ts_node_has_error_wasm = Module._ts_node_has_error_wasm = wasmExports.ts_node_has_error_wasm)(e), _ts_node_is_error_wasm = Module._ts_node_is_error_wasm = (e) => (_ts_node_is_error_wasm = Module._ts_node_is_error_wasm = wasmExports.ts_node_is_error_wasm)(e), _ts_node_is_missing_wasm = Module._ts_node_is_missing_wasm = (e) => (_ts_node_is_missing_wasm = Module._ts_node_is_missing_wasm = wasmExports.ts_node_is_missing_wasm)(e), _ts_node_is_extra_wasm = Module._ts_node_is_extra_wasm = (e) => (_ts_node_is_extra_wasm = Module._ts_node_is_extra_wasm = wasmExports.ts_node_is_extra_wasm)(e), _ts_node_parse_state_wasm = Module._ts_node_parse_state_wasm = (e) => (_ts_node_parse_state_wasm = Module._ts_node_parse_state_wasm = wasmExports.ts_node_parse_state_wasm)(e), _ts_node_next_parse_state_wasm = Module._ts_node_next_parse_state_wasm = (e) => (_ts_node_next_parse_state_wasm = Module._ts_node_next_parse_state_wasm = wasmExports.ts_node_next_parse_state_wasm)(e), _ts_query_matches_wasm = Module._ts_query_matches_wasm = (e, t, _, s, r, a, o, n, l, d) => (_ts_query_matches_wasm = Module._ts_query_matches_wasm = wasmExports.ts_query_matches_wasm)(e, t, _, s, r, a, o, n, l, d), _ts_query_captures_wasm = Module._ts_query_captures_wasm = (e, t, _, s, r, a, o, n, l, d) => (_ts_query_captures_wasm = Module._ts_query_captures_wasm = wasmExports.ts_query_captures_wasm)(e, t, _, s, r, a, o, n, l, d), _iswalpha = Module._iswalpha = (e) => (_iswalpha = Module._iswalpha = wasmExports.iswalpha)(e), _iswblank = Module._iswblank = (e) => (_iswblank = Module._iswblank = wasmExports.iswblank)(e), _iswdigit = Module._iswdigit = (e) => (_iswdigit = Module._iswdigit = wasmExports.iswdigit)(e), _iswlower = Module._iswlower = (e) => (_iswlower = Module._iswlower = wasmExports.iswlower)(e), _iswupper = Module._iswupper = (e) => (_iswupper = Module._iswupper = wasmExports.iswupper)(e), _iswxdigit = Module._iswxdigit = (e) => (_iswxdigit = Module._iswxdigit = wasmExports.iswxdigit)(e), _memchr = Module._memchr = (e, t, _) => (_memchr = Module._memchr = wasmExports.memchr)(e, t, _), _strlen = Module._strlen = (e) => (_strlen = Module._strlen = wasmExports.strlen)(e), _strcmp = Module._strcmp = (e, t) => (_strcmp = Module._strcmp = wasmExports.strcmp)(e, t), _strncat = Module._strncat = (e, t, _) => (_strncat = Module._strncat = wasmExports.strncat)(e, t, _), _strncpy = Module._strncpy = (e, t, _) => (_strncpy = Module._strncpy = wasmExports.strncpy)(e, t, _), _towlower = Module._towlower = (e) => (_towlower = Module._towlower = wasmExports.towlower)(e), _towupper = Module._towupper = (e) => (_towupper = Module._towupper = wasmExports.towupper)(e), _setThrew = (e, t) => (_setThrew = wasmExports.setThrew)(e, t), stackSave = () => (stackSave = wasmExports.stackSave)(), stackRestore = (e) => (stackRestore = wasmExports.stackRestore)(e), stackAlloc = (e) => (stackAlloc = wasmExports.stackAlloc)(e), dynCall_jiji = Module.dynCall_jiji = (e, t, _, s, r) => (dynCall_jiji = Module.dynCall_jiji = wasmExports.dynCall_jiji)(e, t, _, s, r), _orig$ts_parser_timeout_micros = Module._orig$ts_parser_timeout_micros = (e) => (_orig$ts_parser_timeout_micros = Module._orig$ts_parser_timeout_micros = wasmExports.orig$ts_parser_timeout_micros)(e), _orig$ts_parser_set_timeout_micros = Module._orig$ts_parser_set_timeout_micros = (e, t) => (_orig$ts_parser_set_timeout_micros = Module._orig$ts_parser_set_timeout_micros = wasmExports.orig$ts_parser_set_timeout_micros)(e, t), calledRun;
            function callMain(e = []) {
              var t = resolveGlobalSymbol("main").sym;
              if (t) {
                e.unshift(thisProgram);
                var _ = e.length, s = stackAlloc(4 * (_ + 1)), r = s;
                e.forEach((e2) => {
                  HEAPU32[r >> 2] = stringToUTF8OnStack(e2), r += 4;
                }), HEAPU32[r >> 2] = 0;
                try {
                  var a = t(_, s);
                  return exitJS(a, true), a;
                } catch (e2) {
                  return handleException(e2);
                }
              }
            }
            function run(e = arguments_) {
              function t() {
                calledRun || (calledRun = true, Module.calledRun = true, ABORT || (initRuntime(), preMain(), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), shouldRunNow && callMain(e), postRun()));
              }
              runDependencies > 0 || (preRun(), runDependencies > 0 || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  Module.setStatus("");
                }, 1), t();
              }, 1)) : t()));
            }
            if (Module.AsciiToString = AsciiToString, Module.stringToUTF16 = stringToUTF16, dependenciesFulfilled = function e() {
              calledRun || run(), calledRun || (dependenciesFulfilled = e);
            }, Module.preInit) for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0; ) Module.preInit.pop()();
            var shouldRunNow = true;
            Module.noInitialRun && (shouldRunNow = false), run();
            const C = Module, INTERNAL = {}, SIZE_OF_INT = 4, SIZE_OF_CURSOR = 4 * SIZE_OF_INT, SIZE_OF_NODE = 5 * SIZE_OF_INT, SIZE_OF_POINT = 2 * SIZE_OF_INT, SIZE_OF_RANGE = 2 * SIZE_OF_INT + 2 * SIZE_OF_POINT, ZERO_POINT = { row: 0, column: 0 }, QUERY_WORD_REGEX = /[\w-.]*/g, PREDICATE_STEP_TYPE_CAPTURE = 1, PREDICATE_STEP_TYPE_STRING = 2, LANGUAGE_FUNCTION_REGEX = /^_?tree_sitter_\w+/;
            let VERSION, MIN_COMPATIBLE_VERSION, TRANSFER_BUFFER, currentParseCallback, currentLogCallback;
            class ParserImpl {
              static init() {
                TRANSFER_BUFFER = C._ts_init(), VERSION = getValue(TRANSFER_BUFFER, "i32"), MIN_COMPATIBLE_VERSION = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              }
              initialize() {
                C._ts_parser_new_wasm(), this[0] = getValue(TRANSFER_BUFFER, "i32"), this[1] = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              }
              delete() {
                C._ts_parser_delete(this[0]), C._free(this[1]), this[0] = 0, this[1] = 0;
              }
              setLanguage(e) {
                let t;
                if (e) {
                  if (e.constructor !== Language) throw new Error("Argument must be a Language");
                  {
                    t = e[0];
                    const _ = C._ts_language_version(t);
                    if (_ < MIN_COMPATIBLE_VERSION || VERSION < _) throw new Error(`Incompatible language version ${_}. Compatibility range ${MIN_COMPATIBLE_VERSION} through ${VERSION}.`);
                  }
                } else t = 0, e = null;
                return this.language = e, C._ts_parser_set_language(this[0], t), this;
              }
              getLanguage() {
                return this.language;
              }
              parse(e, t, _) {
                if ("string" == typeof e) currentParseCallback = (t2, _2) => e.slice(t2);
                else {
                  if ("function" != typeof e) throw new Error("Argument must be a string or a function");
                  currentParseCallback = e;
                }
                this.logCallback ? (currentLogCallback = this.logCallback, C._ts_parser_enable_logger_wasm(this[0], 1)) : (currentLogCallback = null, C._ts_parser_enable_logger_wasm(this[0], 0));
                let s = 0, r = 0;
                if (_?.includedRanges) {
                  s = _.includedRanges.length, r = C._calloc(s, SIZE_OF_RANGE);
                  let e2 = r;
                  for (let t2 = 0; t2 < s; t2++) marshalRange(e2, _.includedRanges[t2]), e2 += SIZE_OF_RANGE;
                }
                const a = C._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, r, s);
                if (!a) throw currentParseCallback = null, currentLogCallback = null, new Error("Parsing failed");
                const o = new Tree(INTERNAL, a, this.language, currentParseCallback);
                return currentParseCallback = null, currentLogCallback = null, o;
              }
              reset() {
                C._ts_parser_reset(this[0]);
              }
              getIncludedRanges() {
                C._ts_parser_included_ranges_wasm(this[0]);
                const e = getValue(TRANSFER_BUFFER, "i32"), t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), _ = new Array(e);
                if (e > 0) {
                  let s = t;
                  for (let t2 = 0; t2 < e; t2++) _[t2] = unmarshalRange(s), s += SIZE_OF_RANGE;
                  C._free(t);
                }
                return _;
              }
              getTimeoutMicros() {
                return C._ts_parser_timeout_micros(this[0]);
              }
              setTimeoutMicros(e) {
                C._ts_parser_set_timeout_micros(this[0], e);
              }
              setLogger(e) {
                if (e) {
                  if ("function" != typeof e) throw new Error("Logger callback must be a function");
                } else e = null;
                return this.logCallback = e, this;
              }
              getLogger() {
                return this.logCallback;
              }
            }
            class Tree {
              constructor(e, t, _, s) {
                assertInternal(e), this[0] = t, this.language = _, this.textCallback = s;
              }
              copy() {
                const e = C._ts_tree_copy(this[0]);
                return new Tree(INTERNAL, e, this.language, this.textCallback);
              }
              delete() {
                C._ts_tree_delete(this[0]), this[0] = 0;
              }
              edit(e) {
                marshalEdit(e), C._ts_tree_edit_wasm(this[0]);
              }
              get rootNode() {
                return C._ts_tree_root_node_wasm(this[0]), unmarshalNode(this);
              }
              rootNodeWithOffset(e, t) {
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return setValue(_, e, "i32"), marshalPoint(_ + SIZE_OF_INT, t), C._ts_tree_root_node_with_offset_wasm(this[0]), unmarshalNode(this);
              }
              getLanguage() {
                return this.language;
              }
              walk() {
                return this.rootNode.walk();
              }
              getChangedRanges(e) {
                if (e.constructor !== Tree) throw new TypeError("Argument must be a Tree");
                C._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
                const t = getValue(TRANSFER_BUFFER, "i32"), _ = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), s = new Array(t);
                if (t > 0) {
                  let e2 = _;
                  for (let _2 = 0; _2 < t; _2++) s[_2] = unmarshalRange(e2), e2 += SIZE_OF_RANGE;
                  C._free(_);
                }
                return s;
              }
              getIncludedRanges() {
                C._ts_tree_included_ranges_wasm(this[0]);
                const e = getValue(TRANSFER_BUFFER, "i32"), t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), _ = new Array(e);
                if (e > 0) {
                  let s = t;
                  for (let t2 = 0; t2 < e; t2++) _[t2] = unmarshalRange(s), s += SIZE_OF_RANGE;
                  C._free(t);
                }
                return _;
              }
            }
            class Node {
              constructor(e, t) {
                assertInternal(e), this.tree = t;
              }
              get typeId() {
                return marshalNode(this), C._ts_node_symbol_wasm(this.tree[0]);
              }
              get grammarId() {
                return marshalNode(this), C._ts_node_grammar_symbol_wasm(this.tree[0]);
              }
              get type() {
                return this.tree.language.types[this.typeId] || "ERROR";
              }
              get grammarType() {
                return this.tree.language.types[this.grammarId] || "ERROR";
              }
              get endPosition() {
                return marshalNode(this), C._ts_node_end_point_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
              }
              get endIndex() {
                return marshalNode(this), C._ts_node_end_index_wasm(this.tree[0]);
              }
              get text() {
                return getText(this.tree, this.startIndex, this.endIndex);
              }
              get parseState() {
                return marshalNode(this), C._ts_node_parse_state_wasm(this.tree[0]);
              }
              get nextParseState() {
                return marshalNode(this), C._ts_node_next_parse_state_wasm(this.tree[0]);
              }
              get isNamed() {
                return marshalNode(this), 1 === C._ts_node_is_named_wasm(this.tree[0]);
              }
              get hasError() {
                return marshalNode(this), 1 === C._ts_node_has_error_wasm(this.tree[0]);
              }
              get hasChanges() {
                return marshalNode(this), 1 === C._ts_node_has_changes_wasm(this.tree[0]);
              }
              get isError() {
                return marshalNode(this), 1 === C._ts_node_is_error_wasm(this.tree[0]);
              }
              get isMissing() {
                return marshalNode(this), 1 === C._ts_node_is_missing_wasm(this.tree[0]);
              }
              get isExtra() {
                return marshalNode(this), 1 === C._ts_node_is_extra_wasm(this.tree[0]);
              }
              equals(e) {
                return this.id === e.id;
              }
              child(e) {
                return marshalNode(this), C._ts_node_child_wasm(this.tree[0], e), unmarshalNode(this.tree);
              }
              namedChild(e) {
                return marshalNode(this), C._ts_node_named_child_wasm(this.tree[0], e), unmarshalNode(this.tree);
              }
              childForFieldId(e) {
                return marshalNode(this), C._ts_node_child_by_field_id_wasm(this.tree[0], e), unmarshalNode(this.tree);
              }
              childForFieldName(e) {
                const t = this.tree.language.fields.indexOf(e);
                return -1 !== t ? this.childForFieldId(t) : null;
              }
              fieldNameForChild(e) {
                marshalNode(this);
                const t = C._ts_node_field_name_for_child_wasm(this.tree[0], e);
                if (!t) return null;
                return AsciiToString(t);
              }
              childrenForFieldName(e) {
                const t = this.tree.language.fields.indexOf(e);
                return -1 !== t && 0 !== t ? this.childrenForFieldId(t) : [];
              }
              childrenForFieldId(e) {
                marshalNode(this), C._ts_node_children_by_field_id_wasm(this.tree[0], e);
                const t = getValue(TRANSFER_BUFFER, "i32"), _ = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), s = new Array(t);
                if (t > 0) {
                  let e2 = _;
                  for (let _2 = 0; _2 < t; _2++) s[_2] = unmarshalNode(this.tree, e2), e2 += SIZE_OF_NODE;
                  C._free(_);
                }
                return s;
              }
              firstChildForIndex(e) {
                marshalNode(this);
                return setValue(TRANSFER_BUFFER + SIZE_OF_NODE, e, "i32"), C._ts_node_first_child_for_byte_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              firstNamedChildForIndex(e) {
                marshalNode(this);
                return setValue(TRANSFER_BUFFER + SIZE_OF_NODE, e, "i32"), C._ts_node_first_named_child_for_byte_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get childCount() {
                return marshalNode(this), C._ts_node_child_count_wasm(this.tree[0]);
              }
              get namedChildCount() {
                return marshalNode(this), C._ts_node_named_child_count_wasm(this.tree[0]);
              }
              get firstChild() {
                return this.child(0);
              }
              get firstNamedChild() {
                return this.namedChild(0);
              }
              get lastChild() {
                return this.child(this.childCount - 1);
              }
              get lastNamedChild() {
                return this.namedChild(this.namedChildCount - 1);
              }
              get children() {
                if (!this._children) {
                  marshalNode(this), C._ts_node_children_wasm(this.tree[0]);
                  const e = getValue(TRANSFER_BUFFER, "i32"), t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
                  if (this._children = new Array(e), e > 0) {
                    let _ = t;
                    for (let t2 = 0; t2 < e; t2++) this._children[t2] = unmarshalNode(this.tree, _), _ += SIZE_OF_NODE;
                    C._free(t);
                  }
                }
                return this._children;
              }
              get namedChildren() {
                if (!this._namedChildren) {
                  marshalNode(this), C._ts_node_named_children_wasm(this.tree[0]);
                  const e = getValue(TRANSFER_BUFFER, "i32"), t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
                  if (this._namedChildren = new Array(e), e > 0) {
                    let _ = t;
                    for (let t2 = 0; t2 < e; t2++) this._namedChildren[t2] = unmarshalNode(this.tree, _), _ += SIZE_OF_NODE;
                    C._free(t);
                  }
                }
                return this._namedChildren;
              }
              descendantsOfType(e, t, _) {
                Array.isArray(e) || (e = [e]), t || (t = ZERO_POINT), _ || (_ = ZERO_POINT);
                const s = [], r = this.tree.language.types;
                for (let t2 = 0, _2 = r.length; t2 < _2; t2++) e.includes(r[t2]) && s.push(t2);
                const a = C._malloc(SIZE_OF_INT * s.length);
                for (let e2 = 0, t2 = s.length; e2 < t2; e2++) setValue(a + e2 * SIZE_OF_INT, s[e2], "i32");
                marshalNode(this), C._ts_node_descendants_of_type_wasm(this.tree[0], a, s.length, t.row, t.column, _.row, _.column);
                const o = getValue(TRANSFER_BUFFER, "i32"), n = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), l = new Array(o);
                if (o > 0) {
                  let e2 = n;
                  for (let t2 = 0; t2 < o; t2++) l[t2] = unmarshalNode(this.tree, e2), e2 += SIZE_OF_NODE;
                }
                return C._free(n), C._free(a), l;
              }
              get nextSibling() {
                return marshalNode(this), C._ts_node_next_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get previousSibling() {
                return marshalNode(this), C._ts_node_prev_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get nextNamedSibling() {
                return marshalNode(this), C._ts_node_next_named_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get previousNamedSibling() {
                return marshalNode(this), C._ts_node_prev_named_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get descendantCount() {
                return marshalNode(this), C._ts_node_descendant_count_wasm(this.tree[0]);
              }
              get parent() {
                return marshalNode(this), C._ts_node_parent_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              descendantForIndex(e, t = e) {
                if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
                marshalNode(this);
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return setValue(_, e, "i32"), setValue(_ + SIZE_OF_INT, t, "i32"), C._ts_node_descendant_for_index_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              namedDescendantForIndex(e, t = e) {
                if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
                marshalNode(this);
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return setValue(_, e, "i32"), setValue(_ + SIZE_OF_INT, t, "i32"), C._ts_node_named_descendant_for_index_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              descendantForPosition(e, t = e) {
                if (!isPoint(e) || !isPoint(t)) throw new Error("Arguments must be {row, column} objects");
                marshalNode(this);
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return marshalPoint(_, e), marshalPoint(_ + SIZE_OF_POINT, t), C._ts_node_descendant_for_position_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              namedDescendantForPosition(e, t = e) {
                if (!isPoint(e) || !isPoint(t)) throw new Error("Arguments must be {row, column} objects");
                marshalNode(this);
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return marshalPoint(_, e), marshalPoint(_ + SIZE_OF_POINT, t), C._ts_node_named_descendant_for_position_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              walk() {
                return marshalNode(this), C._ts_tree_cursor_new_wasm(this.tree[0]), new TreeCursor(INTERNAL, this.tree);
              }
              toString() {
                marshalNode(this);
                const e = C._ts_node_to_string_wasm(this.tree[0]), t = AsciiToString(e);
                return C._free(e), t;
              }
            }
            class TreeCursor {
              constructor(e, t) {
                assertInternal(e), this.tree = t, unmarshalTreeCursor(this);
              }
              delete() {
                marshalTreeCursor(this), C._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0;
              }
              reset(e) {
                marshalNode(e), marshalTreeCursor(this, TRANSFER_BUFFER + SIZE_OF_NODE), C._ts_tree_cursor_reset_wasm(this.tree[0]), unmarshalTreeCursor(this);
              }
              resetTo(e) {
                marshalTreeCursor(this, TRANSFER_BUFFER), marshalTreeCursor(e, TRANSFER_BUFFER + SIZE_OF_CURSOR), C._ts_tree_cursor_reset_to_wasm(this.tree[0], e.tree[0]), unmarshalTreeCursor(this);
              }
              get nodeType() {
                return this.tree.language.types[this.nodeTypeId] || "ERROR";
              }
              get nodeTypeId() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
              }
              get nodeStateId() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_node_state_id_wasm(this.tree[0]);
              }
              get nodeId() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
              }
              get nodeIsNamed() {
                return marshalTreeCursor(this), 1 === C._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]);
              }
              get nodeIsMissing() {
                return marshalTreeCursor(this), 1 === C._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]);
              }
              get nodeText() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_start_index_wasm(this.tree[0]), t = C._ts_tree_cursor_end_index_wasm(this.tree[0]);
                return getText(this.tree, e, t);
              }
              get startPosition() {
                return marshalTreeCursor(this), C._ts_tree_cursor_start_position_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
              }
              get endPosition() {
                return marshalTreeCursor(this), C._ts_tree_cursor_end_position_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
              }
              get startIndex() {
                return marshalTreeCursor(this), C._ts_tree_cursor_start_index_wasm(this.tree[0]);
              }
              get endIndex() {
                return marshalTreeCursor(this), C._ts_tree_cursor_end_index_wasm(this.tree[0]);
              }
              get currentNode() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_node_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get currentFieldId() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
              }
              get currentFieldName() {
                return this.tree.language.fields[this.currentFieldId];
              }
              get currentDepth() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_depth_wasm(this.tree[0]);
              }
              get currentDescendantIndex() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_descendant_index_wasm(this.tree[0]);
              }
              gotoFirstChild() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
              gotoLastChild() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
              gotoFirstChildForIndex(e) {
                marshalTreeCursor(this), setValue(TRANSFER_BUFFER + SIZE_OF_CURSOR, e, "i32");
                const t = C._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === t;
              }
              gotoFirstChildForPosition(e) {
                marshalTreeCursor(this), marshalPoint(TRANSFER_BUFFER + SIZE_OF_CURSOR, e);
                const t = C._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === t;
              }
              gotoNextSibling() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
              gotoPreviousSibling() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
              gotoDescendant(e) {
                marshalTreeCursor(this), C._ts_tree_cursor_goto_descendant_wasm(this.tree[0], e), unmarshalTreeCursor(this);
              }
              gotoParent() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
            }
            class Language {
              constructor(e, t) {
                assertInternal(e), this[0] = t, this.types = new Array(C._ts_language_symbol_count(this[0]));
                for (let e2 = 0, t2 = this.types.length; e2 < t2; e2++) C._ts_language_symbol_type(this[0], e2) < 2 && (this.types[e2] = UTF8ToString(C._ts_language_symbol_name(this[0], e2)));
                this.fields = new Array(C._ts_language_field_count(this[0]) + 1);
                for (let e2 = 0, t2 = this.fields.length; e2 < t2; e2++) {
                  const t3 = C._ts_language_field_name_for_id(this[0], e2);
                  this.fields[e2] = 0 !== t3 ? UTF8ToString(t3) : null;
                }
              }
              get version() {
                return C._ts_language_version(this[0]);
              }
              get fieldCount() {
                return this.fields.length - 1;
              }
              get stateCount() {
                return C._ts_language_state_count(this[0]);
              }
              fieldIdForName(e) {
                const t = this.fields.indexOf(e);
                return -1 !== t ? t : null;
              }
              fieldNameForId(e) {
                return this.fields[e] || null;
              }
              idForNodeType(e, t) {
                const _ = lengthBytesUTF8(e), s = C._malloc(_ + 1);
                stringToUTF8(e, s, _ + 1);
                const r = C._ts_language_symbol_for_name(this[0], s, _, t);
                return C._free(s), r || null;
              }
              get nodeTypeCount() {
                return C._ts_language_symbol_count(this[0]);
              }
              nodeTypeForId(e) {
                const t = C._ts_language_symbol_name(this[0], e);
                return t ? UTF8ToString(t) : null;
              }
              nodeTypeIsNamed(e) {
                return !!C._ts_language_type_is_named_wasm(this[0], e);
              }
              nodeTypeIsVisible(e) {
                return !!C._ts_language_type_is_visible_wasm(this[0], e);
              }
              nextState(e, t) {
                return C._ts_language_next_state(this[0], e, t);
              }
              lookaheadIterator(e) {
                const t = C._ts_lookahead_iterator_new(this[0], e);
                return t ? new LookaheadIterable(INTERNAL, t, this) : null;
              }
              query(e) {
                const t = lengthBytesUTF8(e), _ = C._malloc(t + 1);
                stringToUTF8(e, _, t + 1);
                const s = C._ts_query_new(this[0], _, t, TRANSFER_BUFFER, TRANSFER_BUFFER + SIZE_OF_INT);
                if (!s) {
                  const t2 = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), s2 = getValue(TRANSFER_BUFFER, "i32"), r2 = UTF8ToString(_, s2).length, a2 = e.substr(r2, 100).split("\n")[0];
                  let o2, n2 = a2.match(QUERY_WORD_REGEX)[0];
                  switch (t2) {
                    case 2:
                      o2 = new RangeError(`Bad node name '${n2}'`);
                      break;
                    case 3:
                      o2 = new RangeError(`Bad field name '${n2}'`);
                      break;
                    case 4:
                      o2 = new RangeError(`Bad capture name @${n2}`);
                      break;
                    case 5:
                      o2 = new TypeError(`Bad pattern structure at offset ${r2}: '${a2}'...`), n2 = "";
                      break;
                    default:
                      o2 = new SyntaxError(`Bad syntax at offset ${r2}: '${a2}'...`), n2 = "";
                  }
                  throw o2.index = r2, o2.length = n2.length, C._free(_), o2;
                }
                const r = C._ts_query_string_count(s), a = C._ts_query_capture_count(s), o = C._ts_query_pattern_count(s), n = new Array(a), l = new Array(r);
                for (let e2 = 0; e2 < a; e2++) {
                  const t2 = C._ts_query_capture_name_for_id(s, e2, TRANSFER_BUFFER), _2 = getValue(TRANSFER_BUFFER, "i32");
                  n[e2] = UTF8ToString(t2, _2);
                }
                for (let e2 = 0; e2 < r; e2++) {
                  const t2 = C._ts_query_string_value_for_id(s, e2, TRANSFER_BUFFER), _2 = getValue(TRANSFER_BUFFER, "i32");
                  l[e2] = UTF8ToString(t2, _2);
                }
                const d = new Array(o), u = new Array(o), m = new Array(o), c = new Array(o), w = new Array(o);
                for (let e2 = 0; e2 < o; e2++) {
                  const t2 = C._ts_query_predicates_for_pattern(s, e2, TRANSFER_BUFFER), _2 = getValue(TRANSFER_BUFFER, "i32");
                  c[e2] = [], w[e2] = [];
                  const r2 = [];
                  let a2 = t2;
                  for (let t3 = 0; t3 < _2; t3++) {
                    const t4 = getValue(a2, "i32");
                    a2 += SIZE_OF_INT;
                    const _3 = getValue(a2, "i32");
                    if (a2 += SIZE_OF_INT, t4 === PREDICATE_STEP_TYPE_CAPTURE) r2.push({ type: "capture", name: n[_3] });
                    else if (t4 === PREDICATE_STEP_TYPE_STRING) r2.push({ type: "string", value: l[_3] });
                    else if (r2.length > 0) {
                      if ("string" !== r2[0].type) throw new Error("Predicates must begin with a literal value");
                      const t5 = r2[0].value;
                      let _4, s2 = true, a3 = true;
                      switch (t5) {
                        case "any-not-eq?":
                        case "not-eq?":
                          s2 = false;
                        case "any-eq?":
                        case "eq?":
                          if (3 !== r2.length) throw new Error(`Wrong number of arguments to \`#${t5}\` predicate. Expected 2, got ${r2.length - 1}`);
                          if ("capture" !== r2[1].type) throw new Error(`First argument of \`#${t5}\` predicate must be a capture. Got "${r2[1].value}"`);
                          if (a3 = !t5.startsWith("any-"), "capture" === r2[2].type) {
                            const t6 = r2[1].name, _5 = r2[2].name;
                            w[e2].push((e3) => {
                              const r3 = [], o3 = [];
                              for (const s3 of e3) s3.name === t6 && r3.push(s3.node), s3.name === _5 && o3.push(s3.node);
                              const n3 = (e4, t7, _6) => _6 ? e4.text === t7.text : e4.text !== t7.text;
                              return a3 ? r3.every((e4) => o3.some((t7) => n3(e4, t7, s2))) : r3.some((e4) => o3.some((t7) => n3(e4, t7, s2)));
                            });
                          } else {
                            _4 = r2[1].name;
                            const t6 = r2[2].value, o3 = (e3) => e3.text === t6, n3 = (e3) => e3.text !== t6;
                            w[e2].push((e3) => {
                              const t7 = [];
                              for (const s3 of e3) s3.name === _4 && t7.push(s3.node);
                              const r3 = s2 ? o3 : n3;
                              return a3 ? t7.every(r3) : t7.some(r3);
                            });
                          }
                          break;
                        case "any-not-match?":
                        case "not-match?":
                          s2 = false;
                        case "any-match?":
                        case "match?":
                          if (3 !== r2.length) throw new Error(`Wrong number of arguments to \`#${t5}\` predicate. Expected 2, got ${r2.length - 1}.`);
                          if ("capture" !== r2[1].type) throw new Error(`First argument of \`#${t5}\` predicate must be a capture. Got "${r2[1].value}".`);
                          if ("string" !== r2[2].type) throw new Error(`Second argument of \`#${t5}\` predicate must be a string. Got @${r2[2].value}.`);
                          _4 = r2[1].name;
                          const o2 = new RegExp(r2[2].value);
                          a3 = !t5.startsWith("any-"), w[e2].push((e3) => {
                            const t6 = [];
                            for (const s3 of e3) s3.name === _4 && t6.push(s3.node.text);
                            const r3 = (e4, t7) => t7 ? o2.test(e4) : !o2.test(e4);
                            return 0 === t6.length ? !s2 : a3 ? t6.every((e4) => r3(e4, s2)) : t6.some((e4) => r3(e4, s2));
                          });
                          break;
                        case "set!":
                          if (r2.length < 2 || r2.length > 3) throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${r2.length - 1}.`);
                          if (r2.some((e3) => "string" !== e3.type)) throw new Error('Arguments to `#set!` predicate must be a strings.".');
                          d[e2] || (d[e2] = {}), d[e2][r2[1].value] = r2[2] ? r2[2].value : null;
                          break;
                        case "is?":
                        case "is-not?":
                          if (r2.length < 2 || r2.length > 3) throw new Error(`Wrong number of arguments to \`#${t5}\` predicate. Expected 1 or 2. Got ${r2.length - 1}.`);
                          if (r2.some((e3) => "string" !== e3.type)) throw new Error(`Arguments to \`#${t5}\` predicate must be a strings.".`);
                          const n2 = "is?" === t5 ? u : m;
                          n2[e2] || (n2[e2] = {}), n2[e2][r2[1].value] = r2[2] ? r2[2].value : null;
                          break;
                        case "not-any-of?":
                          s2 = false;
                        case "any-of?":
                          if (r2.length < 2) throw new Error(`Wrong number of arguments to \`#${t5}\` predicate. Expected at least 1. Got ${r2.length - 1}.`);
                          if ("capture" !== r2[1].type) throw new Error(`First argument of \`#${t5}\` predicate must be a capture. Got "${r2[1].value}".`);
                          for (let e3 = 2; e3 < r2.length; e3++) if ("string" !== r2[e3].type) throw new Error(`Arguments to \`#${t5}\` predicate must be a strings.".`);
                          _4 = r2[1].name;
                          const l2 = r2.slice(2).map((e3) => e3.value);
                          w[e2].push((e3) => {
                            const t6 = [];
                            for (const s3 of e3) s3.name === _4 && t6.push(s3.node.text);
                            return 0 === t6.length ? !s2 : t6.every((e4) => l2.includes(e4)) === s2;
                          });
                          break;
                        default:
                          c[e2].push({ operator: t5, operands: r2.slice(1) });
                      }
                      r2.length = 0;
                    }
                  }
                  Object.freeze(d[e2]), Object.freeze(u[e2]), Object.freeze(m[e2]);
                }
                return C._free(_), new Query(INTERNAL, s, n, w, c, Object.freeze(d), Object.freeze(u), Object.freeze(m));
              }
              static load(e) {
                let t;
                if (e instanceof Uint8Array) t = Promise.resolve(e);
                else {
                  const _ = e;
                  if ("undefined" != typeof process && process.versions && process.versions.node) {
                    const e2 = __require("fs");
                    t = Promise.resolve(e2.readFileSync(_));
                  } else t = fetch(_).then((e2) => e2.arrayBuffer().then((t2) => {
                    if (e2.ok) return new Uint8Array(t2);
                    {
                      const _2 = new TextDecoder("utf-8").decode(t2);
                      throw new Error(`Language.load failed with status ${e2.status}.

${_2}`);
                    }
                  }));
                }
                return t.then((e2) => loadWebAssemblyModule(e2, { loadAsync: true })).then((e2) => {
                  const t2 = Object.keys(e2), _ = t2.find((e3) => LANGUAGE_FUNCTION_REGEX.test(e3) && !e3.includes("external_scanner_"));
                  _ || console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(t2, null, 2)}`);
                  const s = e2[_]();
                  return new Language(INTERNAL, s);
                });
              }
            }
            class LookaheadIterable {
              constructor(e, t, _) {
                assertInternal(e), this[0] = t, this.language = _;
              }
              get currentTypeId() {
                return C._ts_lookahead_iterator_current_symbol(this[0]);
              }
              get currentType() {
                return this.language.types[this.currentTypeId] || "ERROR";
              }
              delete() {
                C._ts_lookahead_iterator_delete(this[0]), this[0] = 0;
              }
              resetState(e) {
                return C._ts_lookahead_iterator_reset_state(this[0], e);
              }
              reset(e, t) {
                return !!C._ts_lookahead_iterator_reset(this[0], e[0], t) && (this.language = e, true);
              }
              [Symbol.iterator]() {
                const e = this;
                return { next: () => C._ts_lookahead_iterator_next(e[0]) ? { done: false, value: e.currentType } : { done: true, value: "" } };
              }
            }
            class Query {
              constructor(e, t, _, s, r, a, o, n) {
                assertInternal(e), this[0] = t, this.captureNames = _, this.textPredicates = s, this.predicates = r, this.setProperties = a, this.assertedProperties = o, this.refutedProperties = n, this.exceededMatchLimit = false;
              }
              delete() {
                C._ts_query_delete(this[0]), this[0] = 0;
              }
              matches(e, { startPosition: t = ZERO_POINT, endPosition: _ = ZERO_POINT, startIndex: s = 0, endIndex: r = 0, matchLimit: a = 4294967295, maxStartDepth: o = 4294967295 } = {}) {
                if ("number" != typeof a) throw new Error("Arguments must be numbers");
                marshalNode(e), C._ts_query_matches_wasm(this[0], e.tree[0], t.row, t.column, _.row, _.column, s, r, a, o);
                const n = getValue(TRANSFER_BUFFER, "i32"), l = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), d = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), u = new Array(n);
                this.exceededMatchLimit = Boolean(d);
                let m = 0, c = l;
                for (let t2 = 0; t2 < n; t2++) {
                  const t3 = getValue(c, "i32");
                  c += SIZE_OF_INT;
                  const _2 = getValue(c, "i32");
                  c += SIZE_OF_INT;
                  const s2 = new Array(_2);
                  if (c = unmarshalCaptures(this, e.tree, c, s2), this.textPredicates[t3].every((e2) => e2(s2))) {
                    u[m] = { pattern: t3, captures: s2 };
                    const e2 = this.setProperties[t3];
                    e2 && (u[m].setProperties = e2);
                    const _3 = this.assertedProperties[t3];
                    _3 && (u[m].assertedProperties = _3);
                    const r2 = this.refutedProperties[t3];
                    r2 && (u[m].refutedProperties = r2), m++;
                  }
                }
                return u.length = m, C._free(l), u;
              }
              captures(e, { startPosition: t = ZERO_POINT, endPosition: _ = ZERO_POINT, startIndex: s = 0, endIndex: r = 0, matchLimit: a = 4294967295, maxStartDepth: o = 4294967295 } = {}) {
                if ("number" != typeof a) throw new Error("Arguments must be numbers");
                marshalNode(e), C._ts_query_captures_wasm(this[0], e.tree[0], t.row, t.column, _.row, _.column, s, r, a, o);
                const n = getValue(TRANSFER_BUFFER, "i32"), l = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), d = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), u = [];
                this.exceededMatchLimit = Boolean(d);
                const m = [];
                let c = l;
                for (let t2 = 0; t2 < n; t2++) {
                  const t3 = getValue(c, "i32");
                  c += SIZE_OF_INT;
                  const _2 = getValue(c, "i32");
                  c += SIZE_OF_INT;
                  const s2 = getValue(c, "i32");
                  if (c += SIZE_OF_INT, m.length = _2, c = unmarshalCaptures(this, e.tree, c, m), this.textPredicates[t3].every((e2) => e2(m))) {
                    const e2 = m[s2], _3 = this.setProperties[t3];
                    _3 && (e2.setProperties = _3);
                    const r2 = this.assertedProperties[t3];
                    r2 && (e2.assertedProperties = r2);
                    const a2 = this.refutedProperties[t3];
                    a2 && (e2.refutedProperties = a2), u.push(e2);
                  }
                }
                return C._free(l), u;
              }
              predicatesForPattern(e) {
                return this.predicates[e];
              }
              disableCapture(e) {
                const t = lengthBytesUTF8(e), _ = C._malloc(t + 1);
                stringToUTF8(e, _, t + 1), C._ts_query_disable_capture(this[0], _, t), C._free(_);
              }
              didExceedMatchLimit() {
                return this.exceededMatchLimit;
              }
            }
            function getText(e, t, _) {
              const s = _ - t;
              let r = e.textCallback(t, null, _);
              for (t += r.length; t < _; ) {
                const s2 = e.textCallback(t, null, _);
                if (!(s2 && s2.length > 0)) break;
                t += s2.length, r += s2;
              }
              return t > _ && (r = r.slice(0, s)), r;
            }
            function unmarshalCaptures(e, t, _, s) {
              for (let r = 0, a = s.length; r < a; r++) {
                const a2 = getValue(_, "i32"), o = unmarshalNode(t, _ += SIZE_OF_INT);
                _ += SIZE_OF_NODE, s[r] = { name: e.captureNames[a2], node: o };
              }
              return _;
            }
            function assertInternal(e) {
              if (e !== INTERNAL) throw new Error("Illegal constructor");
            }
            function isPoint(e) {
              return e && "number" == typeof e.row && "number" == typeof e.column;
            }
            function marshalNode(e) {
              let t = TRANSFER_BUFFER;
              setValue(t, e.id, "i32"), t += SIZE_OF_INT, setValue(t, e.startIndex, "i32"), t += SIZE_OF_INT, setValue(t, e.startPosition.row, "i32"), t += SIZE_OF_INT, setValue(t, e.startPosition.column, "i32"), t += SIZE_OF_INT, setValue(t, e[0], "i32");
            }
            function unmarshalNode(e, t = TRANSFER_BUFFER) {
              const _ = getValue(t, "i32");
              if (0 === _) return null;
              const s = getValue(t += SIZE_OF_INT, "i32"), r = getValue(t += SIZE_OF_INT, "i32"), a = getValue(t += SIZE_OF_INT, "i32"), o = getValue(t += SIZE_OF_INT, "i32"), n = new Node(INTERNAL, e);
              return n.id = _, n.startIndex = s, n.startPosition = { row: r, column: a }, n[0] = o, n;
            }
            function marshalTreeCursor(e, t = TRANSFER_BUFFER) {
              setValue(t + 0 * SIZE_OF_INT, e[0], "i32"), setValue(t + 1 * SIZE_OF_INT, e[1], "i32"), setValue(t + 2 * SIZE_OF_INT, e[2], "i32"), setValue(t + 3 * SIZE_OF_INT, e[3], "i32");
            }
            function unmarshalTreeCursor(e) {
              e[0] = getValue(TRANSFER_BUFFER + 0 * SIZE_OF_INT, "i32"), e[1] = getValue(TRANSFER_BUFFER + 1 * SIZE_OF_INT, "i32"), e[2] = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), e[3] = getValue(TRANSFER_BUFFER + 3 * SIZE_OF_INT, "i32");
            }
            function marshalPoint(e, t) {
              setValue(e, t.row, "i32"), setValue(e + SIZE_OF_INT, t.column, "i32");
            }
            function unmarshalPoint(e) {
              return { row: getValue(e, "i32") >>> 0, column: getValue(e + SIZE_OF_INT, "i32") >>> 0 };
            }
            function marshalRange(e, t) {
              marshalPoint(e, t.startPosition), marshalPoint(e += SIZE_OF_POINT, t.endPosition), setValue(e += SIZE_OF_POINT, t.startIndex, "i32"), setValue(e += SIZE_OF_INT, t.endIndex, "i32"), e += SIZE_OF_INT;
            }
            function unmarshalRange(e) {
              const t = {};
              return t.startPosition = unmarshalPoint(e), e += SIZE_OF_POINT, t.endPosition = unmarshalPoint(e), e += SIZE_OF_POINT, t.startIndex = getValue(e, "i32") >>> 0, e += SIZE_OF_INT, t.endIndex = getValue(e, "i32") >>> 0, t;
            }
            function marshalEdit(e) {
              let t = TRANSFER_BUFFER;
              marshalPoint(t, e.startPosition), t += SIZE_OF_POINT, marshalPoint(t, e.oldEndPosition), t += SIZE_OF_POINT, marshalPoint(t, e.newEndPosition), t += SIZE_OF_POINT, setValue(t, e.startIndex, "i32"), t += SIZE_OF_INT, setValue(t, e.oldEndIndex, "i32"), t += SIZE_OF_INT, setValue(t, e.newEndIndex, "i32"), t += SIZE_OF_INT;
            }
            for (const e of Object.getOwnPropertyNames(ParserImpl.prototype)) Object.defineProperty(Parser.prototype, e, { value: ParserImpl.prototype[e], enumerable: false, writable: false });
            Parser.Language = Language, Module.onRuntimeInitialized = () => {
              ParserImpl.init(), resolveInitPromise();
            };
          }));
        }
      }
      return Parser;
    }();
    "object" == typeof exports && (module.exports = TreeSitter);
  }
});

// node_modules/ignore/index.js
var require_ignore = __commonJS({
  "node_modules/ignore/index.js"(exports2, module2) {
    function makeArray(subject) {
      return Array.isArray(subject) ? subject : [subject];
    }
    var UNDEFINED = void 0;
    var EMPTY = "";
    var SPACE = " ";
    var ESCAPE = "\\";
    var REGEX_TEST_BLANK_LINE = /^\s+$/;
    var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
    var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
    var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
    var REGEX_SPLITALL_CRLF = /\r?\n/g;
    var REGEX_TEST_INVALID_PATH = /^\.{0,2}\/|^\.{1,2}$/;
    var REGEX_TEST_TRAILING_SLASH = /\/$/;
    var SLASH = "/";
    var TMP_KEY_IGNORE = "node-ignore";
    if (typeof Symbol !== "undefined") {
      TMP_KEY_IGNORE = Symbol.for("node-ignore");
    }
    var KEY_IGNORE = TMP_KEY_IGNORE;
    var define = (object, key, value) => {
      Object.defineProperty(object, key, { value });
      return value;
    };
    var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
    var RETURN_FALSE = () => false;
    var sanitizeRange = (range) => range.replace(
      REGEX_REGEXP_RANGE,
      (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY
    );
    var cleanRangeBackSlash = (slashes) => {
      const { length } = slashes;
      return slashes.slice(0, length - length % 2);
    };
    var REPLACERS = [
      [
        // Remove BOM
        // TODO:
        // Other similar zero-width characters?
        /^\uFEFF/,
        () => EMPTY
      ],
      // > Trailing spaces are ignored unless they are quoted with backslash ("\")
      [
        // (a\ ) -> (a )
        // (a  ) -> (a)
        // (a ) -> (a)
        // (a \ ) -> (a  )
        /((?:\\\\)*?)(\\?\s+)$/,
        (_, m1, m2) => m1 + (m2.indexOf("\\") === 0 ? SPACE : EMPTY)
      ],
      // Replace (\ ) with ' '
      // (\ ) -> ' '
      // (\\ ) -> '\\ '
      // (\\\ ) -> '\\ '
      [
        /(\\+?)\s/g,
        (_, m1) => {
          const { length } = m1;
          return m1.slice(0, length - length % 2) + SPACE;
        }
      ],
      // Escape metacharacters
      // which is written down by users but means special for regular expressions.
      // > There are 12 characters with special meanings:
      // > - the backslash \,
      // > - the caret ^,
      // > - the dollar sign $,
      // > - the period or dot .,
      // > - the vertical bar or pipe symbol |,
      // > - the question mark ?,
      // > - the asterisk or star *,
      // > - the plus sign +,
      // > - the opening parenthesis (,
      // > - the closing parenthesis ),
      // > - and the opening square bracket [,
      // > - the opening curly brace {,
      // > These special characters are often called "metacharacters".
      [
        /[\\$.|*+(){^]/g,
        (match) => `\\${match}`
      ],
      [
        // > a question mark (?) matches a single character
        /(?!\\)\?/g,
        () => "[^/]"
      ],
      // leading slash
      [
        // > A leading slash matches the beginning of the pathname.
        // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
        // A leading slash matches the beginning of the pathname
        /^\//,
        () => "^"
      ],
      // replace special metacharacter slash after the leading slash
      [
        /\//g,
        () => "\\/"
      ],
      [
        // > A leading "**" followed by a slash means match in all directories.
        // > For example, "**/foo" matches file or directory "foo" anywhere,
        // > the same as pattern "foo".
        // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
        // >   under directory "foo".
        // Notice that the '*'s have been replaced as '\\*'
        /^\^*\\\*\\\*\\\//,
        // '**/foo' <-> 'foo'
        () => "^(?:.*\\/)?"
      ],
      // starting
      [
        // there will be no leading '/'
        //   (which has been replaced by section "leading slash")
        // If starts with '**', adding a '^' to the regular expression also works
        /^(?=[^^])/,
        function startingReplacer() {
          return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
        }
      ],
      // two globstars
      [
        // Use lookahead assertions so that we could match more than one `'/**'`
        /\\\/\\\*\\\*(?=\\\/|$)/g,
        // Zero, one or several directories
        // should not use '*', or it will be replaced by the next replacer
        // Check if it is not the last `'/**'`
        (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
      ],
      // normal intermediate wildcards
      [
        // Never replace escaped '*'
        // ignore rule '\*' will match the path '*'
        // 'abc.*/' -> go
        // 'abc.*'  -> skip this rule,
        //    coz trailing single wildcard will be handed by [trailing wildcard]
        /(^|[^\\]+)(\\\*)+(?=.+)/g,
        // '*.js' matches '.js'
        // '*.js' doesn't match 'abc'
        (_, p1, p2) => {
          const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
          return p1 + unescaped;
        }
      ],
      [
        // unescape, revert step 3 except for back slash
        // For example, if a user escape a '\\*',
        // after step 3, the result will be '\\\\\\*'
        /\\\\\\(?=[$.|*+(){^])/g,
        () => ESCAPE
      ],
      [
        // '\\\\' -> '\\'
        /\\\\/g,
        () => ESCAPE
      ],
      [
        // > The range notation, e.g. [a-zA-Z],
        // > can be used to match one of the characters in a range.
        // `\` is escaped by step 3
        /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
        (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
      ],
      // ending
      [
        // 'js' will not match 'js.'
        // 'ab' will not match 'abc'
        /(?:[^*])$/,
        // WTF!
        // https://git-scm.com/docs/gitignore
        // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
        // which re-fixes #24, #38
        // > If there is a separator at the end of the pattern then the pattern
        // > will only match directories, otherwise the pattern can match both
        // > files and directories.
        // 'js*' will not match 'a.js'
        // 'js/' will not match 'a.js'
        // 'js' will match 'a.js' and 'a.js/'
        (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
      ]
    ];
    var REGEX_REPLACE_TRAILING_WILDCARD = /(^|\\\/)?\\\*$/;
    var MODE_IGNORE = "regex";
    var MODE_CHECK_IGNORE = "checkRegex";
    var UNDERSCORE = "_";
    var TRAILING_WILD_CARD_REPLACERS = {
      [MODE_IGNORE](_, p1) {
        const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
        return `${prefix}(?=$|\\/$)`;
      },
      [MODE_CHECK_IGNORE](_, p1) {
        const prefix = p1 ? `${p1}[^/]*` : "[^/]*";
        return `${prefix}(?=$|\\/$)`;
      }
    };
    var makeRegexPrefix = (pattern) => REPLACERS.reduce(
      (prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern)),
      pattern
    );
    var isString = (subject) => typeof subject === "string";
    var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
    var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF).filter(Boolean);
    var IgnoreRule = class {
      constructor(pattern, mark, body2, ignoreCase, negative, prefix) {
        this.pattern = pattern;
        this.mark = mark;
        this.negative = negative;
        define(this, "body", body2);
        define(this, "ignoreCase", ignoreCase);
        define(this, "regexPrefix", prefix);
      }
      get regex() {
        const key = UNDERSCORE + MODE_IGNORE;
        if (this[key]) {
          return this[key];
        }
        return this._make(MODE_IGNORE, key);
      }
      get checkRegex() {
        const key = UNDERSCORE + MODE_CHECK_IGNORE;
        if (this[key]) {
          return this[key];
        }
        return this._make(MODE_CHECK_IGNORE, key);
      }
      _make(mode, key) {
        const str = this.regexPrefix.replace(
          REGEX_REPLACE_TRAILING_WILDCARD,
          // It does not need to bind pattern
          TRAILING_WILD_CARD_REPLACERS[mode]
        );
        const regex = this.ignoreCase ? new RegExp(str, "i") : new RegExp(str);
        return define(this, key, regex);
      }
    };
    var createRule = ({
      pattern,
      mark
    }, ignoreCase) => {
      let negative = false;
      let body2 = pattern;
      if (body2.indexOf("!") === 0) {
        negative = true;
        body2 = body2.substr(1);
      }
      body2 = body2.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
      const regexPrefix = makeRegexPrefix(body2);
      return new IgnoreRule(
        pattern,
        mark,
        body2,
        ignoreCase,
        negative,
        regexPrefix
      );
    };
    var RuleManager = class {
      constructor(ignoreCase) {
        this._ignoreCase = ignoreCase;
        this._rules = [];
      }
      _add(pattern) {
        if (pattern && pattern[KEY_IGNORE]) {
          this._rules = this._rules.concat(pattern._rules._rules);
          this._added = true;
          return;
        }
        if (isString(pattern)) {
          pattern = {
            pattern
          };
        }
        if (checkPattern(pattern.pattern)) {
          const rule = createRule(pattern, this._ignoreCase);
          this._added = true;
          this._rules.push(rule);
        }
      }
      // @param {Array<string> | string | Ignore} pattern
      add(pattern) {
        this._added = false;
        makeArray(
          isString(pattern) ? splitPattern(pattern) : pattern
        ).forEach(this._add, this);
        return this._added;
      }
      // Test one single path without recursively checking parent directories
      //
      // - checkUnignored `boolean` whether should check if the path is unignored,
      //   setting `checkUnignored` to `false` could reduce additional
      //   path matching.
      // - check `string` either `MODE_IGNORE` or `MODE_CHECK_IGNORE`
      // @returns {TestResult} true if a file is ignored
      test(path, checkUnignored, mode) {
        let ignored = false;
        let unignored = false;
        let matchedRule;
        this._rules.forEach((rule) => {
          const { negative } = rule;
          if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
            return;
          }
          const matched = rule[mode].test(path);
          if (!matched) {
            return;
          }
          ignored = !negative;
          unignored = negative;
          matchedRule = negative ? UNDEFINED : rule;
        });
        const ret = {
          ignored,
          unignored
        };
        if (matchedRule) {
          ret.rule = matchedRule;
        }
        return ret;
      }
    };
    var throwError = (message, Ctor) => {
      throw new Ctor(message);
    };
    var checkPath = (path, originalPath, doThrow) => {
      if (!isString(path)) {
        return doThrow(
          `path must be a string, but got \`${originalPath}\``,
          TypeError
        );
      }
      if (!path) {
        return doThrow(`path must not be empty`, TypeError);
      }
      if (checkPath.isNotRelative(path)) {
        const r = "`path.relative()`d";
        return doThrow(
          `path should be a ${r} string, but got "${originalPath}"`,
          RangeError
        );
      }
      return true;
    };
    var isNotRelative = (path) => REGEX_TEST_INVALID_PATH.test(path);
    checkPath.isNotRelative = isNotRelative;
    checkPath.convert = (p) => p;
    var Ignore = class {
      constructor({
        ignorecase = true,
        ignoreCase = ignorecase,
        allowRelativePaths = false
      } = {}) {
        define(this, KEY_IGNORE, true);
        this._rules = new RuleManager(ignoreCase);
        this._strictPathCheck = !allowRelativePaths;
        this._initCache();
      }
      _initCache() {
        this._ignoreCache = /* @__PURE__ */ Object.create(null);
        this._testCache = /* @__PURE__ */ Object.create(null);
      }
      add(pattern) {
        if (this._rules.add(pattern)) {
          this._initCache();
        }
        return this;
      }
      // legacy
      addPattern(pattern) {
        return this.add(pattern);
      }
      // @returns {TestResult}
      _test(originalPath, cache, checkUnignored, slices) {
        const path = originalPath && checkPath.convert(originalPath);
        checkPath(
          path,
          originalPath,
          this._strictPathCheck ? throwError : RETURN_FALSE
        );
        return this._t(path, cache, checkUnignored, slices);
      }
      checkIgnore(path) {
        if (!REGEX_TEST_TRAILING_SLASH.test(path)) {
          return this.test(path);
        }
        const slices = path.split(SLASH).filter(Boolean);
        slices.pop();
        if (slices.length) {
          const parent = this._t(
            slices.join(SLASH) + SLASH,
            this._testCache,
            true,
            slices
          );
          if (parent.ignored) {
            return parent;
          }
        }
        return this._rules.test(path, false, MODE_CHECK_IGNORE);
      }
      _t(path, cache, checkUnignored, slices) {
        if (path in cache) {
          return cache[path];
        }
        if (!slices) {
          slices = path.split(SLASH).filter(Boolean);
        }
        slices.pop();
        if (!slices.length) {
          return cache[path] = this._rules.test(path, checkUnignored, MODE_IGNORE);
        }
        const parent = this._t(
          slices.join(SLASH) + SLASH,
          cache,
          checkUnignored,
          slices
        );
        return cache[path] = parent.ignored ? parent : this._rules.test(path, checkUnignored, MODE_IGNORE);
      }
      ignores(path) {
        return this._test(path, this._ignoreCache, false).ignored;
      }
      createFilter() {
        return (path) => !this.ignores(path);
      }
      filter(paths) {
        return makeArray(paths).filter(this.createFilter());
      }
      // @returns {TestResult}
      test(path) {
        return this._test(path, this._testCache, true);
      }
    };
    var factory = (options) => new Ignore(options);
    var isPathValid = (path) => checkPath(path && checkPath.convert(path), path, RETURN_FALSE);
    var setupWindows = () => {
      const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
      checkPath.convert = makePosix;
      const REGEX_TEST_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
      checkPath.isNotRelative = (path) => REGEX_TEST_WINDOWS_PATH_ABSOLUTE.test(path) || isNotRelative(path);
    };
    if (
      // Detect `process` so that it can run in browsers.
      typeof process !== "undefined" && process.platform === "win32"
    ) {
      setupWindows();
    }
    module2.exports = factory;
    factory.default = factory;
    module2.exports.isPathValid = isPathValid;
    define(module2.exports, Symbol.for("setupWindows"), setupWindows);
  }
});

// src/cli.ts
import { spawn } from "node:child_process";
import { existsSync as existsSync6, readdirSync as readdirSync3, readFileSync as readFileSync7 } from "node:fs";
import { isAbsolute, resolve as resolve2 } from "node:path";
import { parseArgs } from "node:util";

// src/hooks.ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative } from "node:path";
var AGENTS = ["claude", "cursor", "codex"];
var HOOK_MARKER = "MFMAP_HOOK=1";
var HOOK_TIMEOUT_SECONDS = 120;
var INSTALLED_CLI = ".agents/skills/codebase-map/bin/mfmap.mjs";
var TARGETS = {
  // Personal and uncommitted, so it may hold absolute paths.
  claude: {
    file: ".claude/settings.local.json",
    install: (settings, command) => withGroups(settings, {
      PostToolUse: { matcher: "Edit|Write|MultiEdit|NotebookEdit", hooks: [{ type: "command", command, timeout: HOOK_TIMEOUT_SECONDS }] },
      Stop: { hooks: [{ type: "command", command, timeout: HOOK_TIMEOUT_SECONDS }] }
    })
  },
  // Project hooks run from the project root. Cursor's format has flat handler lists per event.
  cursor: {
    file: ".cursor/hooks.json",
    install: (settings, command) => {
      const hooks = settings.hooks ?? {};
      const add = (event) => [...hooks[event] ?? [], { command, timeout: HOOK_TIMEOUT_SECONDS }];
      return { version: 1, ...settings, hooks: { ...hooks, afterFileEdit: add("afterFileEdit"), stop: add("stop") } };
    }
  },
  // Codex reports apply_patch edits as apply_patch, Edit, or Write. Repo hooks must be trusted via /hooks.
  codex: {
    file: ".codex/hooks.json",
    install: (settings, command) => withGroups(settings, {
      PostToolUse: { matcher: "apply_patch|Edit|Write", hooks: [{ type: "command", command, timeout: HOOK_TIMEOUT_SECONDS }] },
      Stop: { hooks: [{ type: "command", command, timeout: HOOK_TIMEOUT_SECONDS }] }
    })
  }
};
function parseAgents(value) {
  const names = (value ?? "claude").split(",").map((name2) => name2.trim()).filter(Boolean);
  const agents = names.flatMap((name2) => name2 === "all" ? [...AGENTS] : [name2]);
  const unknown = agents.filter((name2) => !AGENTS.includes(name2));
  if (unknown.length > 0) throw new Error(`Unknown agent "${unknown.join(", ")}". Use ${AGENTS.join(", ")}, or all.`);
  return [...new Set(agents)];
}
function installHooks(projectRoot, mapDir, agents) {
  return agents.map((agent) => {
    const target = TARGETS[agent];
    const path = join(projectRoot, target.file);
    const command = updateCommand(agent, projectRoot, mapDir);
    writeJson(path, target.install(withoutMfmapHooks(readJson(path)), command));
    return path;
  });
}
function uninstallHooks(projectRoot, agents) {
  return agents.map((agent) => join(projectRoot, TARGETS[agent].file)).filter((path) => existsSync(path)).map((path) => {
    writeJson(path, withoutMfmapHooks(readJson(path)));
    return path;
  });
}
function updateCommand(agent, projectRoot, mapDir) {
  return `${HOOK_MARKER}; [ -f ${cliPath()} ] && node ${cliPath()} update --quiet --map ${mapArgument(agent, projectRoot, mapDir)} >/dev/null 2>&1; echo '{}'`;
}
function cliPath() {
  const running = process.argv[1];
  const installed = join(homedir(), INSTALLED_CLI);
  if (existsSync(installed) && realpathSync(installed) === realpathSync(running)) return `"$HOME/${INSTALLED_CLI}"`;
  return shellQuote(running);
}
function mapArgument(agent, projectRoot, mapDir) {
  if (agent === "claude") return shellQuote(mapDir);
  if (agent === "cursor") return shellQuote(relative(projectRoot, mapDir));
  const gitRoot = gitRootOf(projectRoot);
  if (!gitRoot) return shellQuote(mapDir);
  return `"$(git rev-parse --show-toplevel)"/${shellQuote(relative(gitRoot, realpathSync(mapDir)))}`;
}
function gitRootOf(dir) {
  try {
    const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return realpathSync(root.trim());
  } catch {
    return void 0;
  }
}
function shellQuote(value) {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}
function withGroups(settings, added) {
  const hooks = { ...settings.hooks ?? {} };
  for (const [event, group] of Object.entries(added)) hooks[event] = [...hooks[event] ?? [], group];
  return { ...settings, hooks };
}
function withoutMfmapHooks(settings) {
  const hooks = settings.hooks;
  if (!hooks) return settings;
  const isOurs = (handler) => Boolean(handler.command?.includes(HOOK_MARKER));
  const kept = {};
  for (const [event, entries] of Object.entries(hooks)) {
    const remaining = entries.map((entry) => "hooks" in entry ? { ...entry, hooks: entry.hooks.filter((h) => !isOurs(h)) } : entry).filter((entry) => "hooks" in entry ? entry.hooks.length > 0 : !isOurs(entry));
    if (remaining.length > 0) kept[event] = remaining;
  }
  const { hooks: _removed, ...rest } = settings;
  return Object.keys(kept).length > 0 ? { ...rest, hooks: kept } : rest;
}
function readJson(path) {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Cannot update ${path}: it is not valid JSON (${error.message}). Fix it and retry.`);
  }
}
function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}
`);
}

// src/instruction-pointer.ts
import { existsSync as existsSync2, readFileSync as readFileSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { join as join2 } from "node:path";
var BEGIN = "<!-- mfmap:begin -->";
var END = "<!-- mfmap:end -->";
var INSTRUCTION_FILES = ["AGENTS.md", "CLAUDE.md"];
function mapPointer(mapDir) {
  const page = `${mapDir}/MAP.md`;
  return [
    BEGIN,
    `> **Codebase map:** for the location of anything in this codebase (files, symbols, imports, dependencies), refer to the map at [\`${page}\`](${page}) before searching. After adding, removing, or changing files, run \`mfmap update\` (the codebase-map skill's CLI, usually \`node ~/.agents/skills/codebase-map/bin/mfmap.mjs\`) to keep it current.`,
    END
  ].join("\n");
}
function writeInstructionPointers(projectRoot, mapDir) {
  const results = {};
  for (const name2 of INSTRUCTION_FILES) {
    const path = join2(projectRoot, name2);
    if (!existsSync2(path)) {
      results[name2] = "missing";
      continue;
    }
    const current = readFileSync2(path, "utf8");
    const importsAgentsMd = name2 === "CLAUDE.md" && /^@\.?\/?AGENTS\.md\s*$/m.test(current);
    if (importsAgentsMd && results["AGENTS.md"] !== "missing" && !current.includes(BEGIN)) {
      results[name2] = "imports AGENTS.md";
      continue;
    }
    results[name2] = writePointer(path, current, mapPointer(mapDir));
  }
  return results;
}
function writePointer(path, current, pointer) {
  const begin = current.indexOf(BEGIN);
  const end = current.indexOf(END);
  if (begin !== -1 && end > begin) {
    const next = current.slice(0, begin) + pointer + current.slice(end + END.length);
    if (next === current) return "unchanged";
    writeFileSync2(path, next);
    return "updated";
  }
  writeFileSync2(path, `${pointer}

${current}`);
  return "added";
}
function describePointerResults(results) {
  return Object.entries(results).map(([name2, result]) => `${name2}: ${result}`).join(", ");
}

// src/map/map-folder.ts
import { existsSync as existsSync3, mkdirSync as mkdirSync2, readdirSync, readFileSync as readFileSync3, rmSync, writeFileSync as writeFileSync3 } from "node:fs";
import { dirname as dirname2, join as join3, relative as relative2, resolve } from "node:path";
var CONFIG_FILE = "mfmap.json";
var SEARCH_DEPTH = 3;
var SKIPPED_DIRS = /* @__PURE__ */ new Set(["node_modules", ".git", ".venv", "venv", "dist", "build", "target", "Pods", ".next"]);
var MapFolder = class _MapFolder {
  dir;
  config;
  constructor(dir, config) {
    this.dir = dir;
    this.config = config;
  }
  get root() {
    return resolve(this.dir, this.config.root);
  }
  /** The map folder's path relative to the project root, in POSIX form. */
  get relativeDir() {
    return relative2(this.root, this.dir).split("\\").join("/");
  }
  path(...segments) {
    return join3(this.dir, ...segments);
  }
  readJson(name2) {
    try {
      return JSON.parse(readFileSync3(this.path(name2), "utf8"));
    } catch {
      return void 0;
    }
  }
  /** Writes only when content differs, so unchanged map files keep clean diffs and timestamps. */
  writeIfChanged(name2, content) {
    const target = this.path(name2);
    if (existsSync3(target) && readFileSync3(target, "utf8") === content) return false;
    mkdirSync2(dirname2(target), { recursive: true });
    writeFileSync3(target, content);
    return true;
  }
  writeJson(name2, value) {
    return this.writeIfChanged(name2, `${JSON.stringify(value, null, 2)}
`);
  }
  /** Deletes files in `subdir` that are not in `keep`. */
  pruneDir(subdir, keep) {
    const dir = this.path(subdir);
    if (!existsSync3(dir)) return [];
    const removed = readdirSync(dir).filter((name2) => !keep.has(name2));
    for (const name2 of removed) rmSync(join3(dir, name2));
    return removed;
  }
  static create(dir, projectRoot) {
    const config = {
      schema: 1,
      root: relative2(dir, projectRoot) || ".",
      exclude: [],
      areaFileLimit: 80
    };
    mkdirSync2(dir, { recursive: true });
    const folder = new _MapFolder(dir, config);
    folder.writeJson(CONFIG_FILE, config);
    folder.writeIfChanged(".gitignore", ".cache/\n");
    return folder;
  }
  static open(dir) {
    const config = JSON.parse(readFileSync3(join3(dir, CONFIG_FILE), "utf8"));
    if (config.schema !== 1) throw new Error(`${join3(dir, CONFIG_FILE)} is not an mfmap config (schema ${config.schema}).`);
    return new _MapFolder(dir, { root: "..", exclude: [], areaFileLimit: 80, ...config, schema: 1 });
  }
  /**
   * Finds the map folder for `start`: an enclosing map folder, or one at most three levels
   * below `start` or below the enclosing git work tree root.
   */
  static find(start2) {
    const ancestors = ancestorsOf(resolve(start2));
    const enclosing = ancestors.find((dir) => existsSync3(join3(dir, CONFIG_FILE)));
    if (enclosing) return _MapFolder.open(enclosing);
    const gitRoot = ancestors.find((dir) => existsSync3(join3(dir, ".git")));
    const searchRoots = [...new Set([ancestors[0], gitRoot].filter((dir) => dir !== void 0))];
    for (const root of searchRoots) {
      const found = findConfigBelow(root, SEARCH_DEPTH);
      if (found) return _MapFolder.open(found);
    }
    return void 0;
  }
};
function ancestorsOf(dir) {
  const dirs = [dir];
  while (dirname2(dirs[dirs.length - 1]) !== dirs[dirs.length - 1]) dirs.push(dirname2(dirs[dirs.length - 1]));
  return dirs;
}
function findConfigBelow(dir, depth) {
  if (depth === 0) return void 0;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return void 0;
  }
  const subdirs = entries.filter((entry) => entry.isDirectory() && !SKIPPED_DIRS.has(entry.name)).map((entry) => join3(dir, entry.name)).sort();
  const direct = subdirs.find((sub) => existsSync3(join3(sub, CONFIG_FILE)));
  if (direct) return direct;
  for (const sub of subdirs) {
    const nested = findConfigBelow(sub, depth - 1);
    if (nested) return nested;
  }
  return void 0;
}

// src/map/summaries.ts
import { createHash } from "node:crypto";

// src/paths.ts
import { posix } from "node:path";
function dirOf(path) {
  const dir = posix.dirname(path);
  return dir === "." ? "" : dir;
}
function joinRepoPath(...segments) {
  const joined = posix.normalize(segments.filter(Boolean).join("/"));
  if (joined === "." || joined === "./") return "";
  if (joined.startsWith("../") || joined === ".." || joined.startsWith("/")) return void 0;
  return joined.replace(/\/$/, "");
}
function baseName(path) {
  return posix.basename(path);
}
function stemOf(path) {
  const base = posix.basename(path);
  const dot = base.lastIndexOf(".");
  return dot > 0 ? base.slice(0, dot) : base;
}
function extensionOf(path) {
  return posix.extname(path).toLowerCase();
}
function isWithin(path, dir) {
  return dir === "" || path === dir || path.startsWith(`${dir}/`);
}
function ancestorDirs(path) {
  const dirs = [];
  let dir = dirOf(path);
  while (true) {
    dirs.push(dir);
    if (dir === "") return dirs;
    dir = dirOf(dir);
  }
}

// src/map/summaries.ts
var SUMMARIES_FILE = "summaries.json";
function emptySummaries() {
  return { files: {}, dirs: {} };
}
function needsSummary(entry) {
  if (entry.category === "test" || entry.category === "asset") return false;
  return entry.fileType !== "Lockfile" && entry.skipped !== "binary";
}
function directorySignatures(index) {
  const children = /* @__PURE__ */ new Map();
  for (const file of index.files) {
    let child = file.path;
    for (const dir of ancestorDirs(file.path)) {
      if (!children.has(dir)) children.set(dir, /* @__PURE__ */ new Set());
      children.get(dir).add(child);
      child = dir;
    }
  }
  const signatures = /* @__PURE__ */ new Map();
  for (const [dir, names] of children) {
    if (dir === "") continue;
    signatures.set(dir, createHash("sha256").update([...names].sort().join("\n")).digest("hex").slice(0, 16));
  }
  return signatures;
}
var SummaryBook = class {
  data;
  entries;
  dirSignatures;
  constructor(data, index) {
    this.data = data;
    this.entries = new Map(index.files.map((entry) => [entry.path, entry]));
    this.dirSignatures = directorySignatures(index);
  }
  fileSummary(path) {
    const record = this.data.files[path];
    if (!record) return void 0;
    return { text: record.summary, stale: record.hash !== this.entries.get(path)?.hash };
  }
  dirSummary(dir) {
    const record = this.data.dirs[dir];
    if (!record) return void 0;
    return { text: record.summary, stale: record.hash !== this.dirSignatures.get(dir) };
  }
  /** Files and directories without a current summary. Code files come first. */
  pending() {
    const files = [...this.entries.values()].filter(needsSummary).sort((a, b) => Number(b.category === "code") - Number(a.category === "code") || a.path.localeCompare(b.path)).map((entry) => ({ path: entry.path, summary: this.fileSummary(entry.path) })).filter(({ summary }) => !summary || summary.stale).map(({ path, summary }) => ({ path, reason: summary ? "stale" : "missing" }));
    const dirs = [...this.dirSignatures.keys()].sort().map((path) => ({ path, summary: this.dirSummary(path) })).filter(({ summary }) => !summary || summary.stale).map(({ path, summary }) => ({ path, reason: summary ? "stale" : "missing" }));
    return { files, dirs };
  }
  /** Records summaries against the current file hashes. Returns paths that are not in the map. */
  apply(input) {
    const unknown = [];
    for (const [path, summary] of Object.entries(input.files ?? {})) {
      const entry = this.entries.get(path);
      if (!entry) unknown.push(path);
      else this.data.files[path] = { hash: entry.hash, summary: oneLine(summary) };
    }
    for (const [rawDir, summary] of Object.entries(input.dirs ?? {})) {
      const dir = rawDir.replace(/\/+$/, "");
      const signature = this.dirSignatures.get(dir);
      if (!signature) unknown.push(rawDir);
      else this.data.dirs[dir] = { hash: signature, summary: oneLine(summary) };
    }
    return unknown;
  }
  /** Summaries of files and directories that no longer exist, dropped and returned as paths. */
  pruneRemoved() {
    const removed = [];
    for (const path of Object.keys(this.data.files)) {
      if (!this.entries.has(path)) {
        delete this.data.files[path];
        removed.push(path);
      }
    }
    for (const dir of Object.keys(this.data.dirs)) {
      if (!this.dirSignatures.has(dir)) {
        delete this.data.dirs[dir];
        removed.push(`${dir}/`);
      }
    }
    return removed;
  }
  /** Sorted copy for stable output on disk. */
  toJSON() {
    const sorted = (record) => Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
    return { files: sorted(this.data.files), dirs: sorted(this.data.dirs) };
  }
};
function oneLine(text) {
  return text.replace(/\s+/g, " ").trim();
}

// src/map/update-map.ts
import { readFileSync as readFileSync6, statSync as statSync2 } from "node:fs";
import { basename, join as join7 } from "node:path";

// src/parse/parser.ts
var import_web_tree_sitter = __toESM(require_tree_sitter(), 1);
import { existsSync as existsSync4 } from "node:fs";
import { createRequire } from "node:module";
import { dirname as dirname3, join as join4 } from "node:path";
import { fileURLToPath } from "node:url";
function locateWasmDirs() {
  const bundled = join4(dirname3(fileURLToPath(import.meta.url)), "grammars");
  if (existsSync4(join4(bundled, "tree-sitter.wasm"))) return { runtimeDir: bundled, grammarDir: bundled };
  const require2 = createRequire(import.meta.url);
  return {
    runtimeDir: dirname3(require2.resolve("web-tree-sitter/tree-sitter.wasm")),
    grammarDir: join4(dirname3(require2.resolve("tree-sitter-wasms/package.json")), "out")
  };
}
var SourceParser = class _SourceParser {
  parser;
  grammarDir;
  loaded = /* @__PURE__ */ new Map();
  constructor(parser, grammarDir) {
    this.parser = parser;
    this.grammarDir = grammarDir;
  }
  static async create() {
    const { runtimeDir, grammarDir } = locateWasmDirs();
    await import_web_tree_sitter.default.init({ locateFile: (name2) => join4(runtimeDir, name2) });
    return new _SourceParser(new import_web_tree_sitter.default(), grammarDir);
  }
  /** Parses source and hands the root to `read`. The tree is freed afterwards. */
  async parse(language, source, read) {
    this.parser.setLanguage(await this.grammarFor(language));
    const tree = this.parser.parse(source);
    try {
      return read(tree.rootNode);
    } finally {
      tree.delete();
    }
  }
  async grammarFor(language) {
    const cached2 = this.loaded.get(language.grammar);
    if (cached2) return cached2;
    const grammar = await import_web_tree_sitter.default.Language.load(join4(this.grammarDir, `tree-sitter-${language.grammar}.wasm`));
    this.loaded.set(language.grammar, grammar);
    return grammar;
  }
};

// src/map/generator.ts
var GENERATOR_NAME = "mfmap 0.1.0";

// src/render/markdown.ts
function code(text) {
  return text.includes("`") ? `\`\` ${text} \`\`` : `\`${text}\``;
}
function joinParts(parts2) {
  return parts2.filter((part) => Boolean(part)).join(" \xB7 ");
}
function plural(count, singular, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
function tsvCell(value) {
  return String(value ?? "").replace(/[\t\r\n]+/g, " ");
}
function tsv(header2, rows) {
  return `${[header2, ...rows].map((row) => row.map(tsvCell).join("	")).join("\n")}
`;
}

// src/render/area-page.ts
var MAX_LISTED_IMPORTERS = 12;
var MAX_LISTED_MEMBERS = 40;
function renderAreaPage(view, area) {
  const entries = area.files.map((path) => view.entries.get(path));
  const codeEntries = entries.filter((entry) => entry.language);
  const otherEntries = entries.filter((entry) => !entry.language);
  const title = area.dir === "" ? "Project root" : `${area.dir}/`;
  const lines = [
    `# ${title}`,
    "",
    `Part of the [codebase map](../MAP.md). ${areaScope(view, area)}`,
    ""
  ];
  const summary = area.dir && view.describeDir(area.dir);
  if (summary) lines.push(summary, "");
  lines.push(...relationshipLines(view, area));
  for (const entry of codeEntries) lines.push(...fileSection(view, entry));
  if (otherEntries.length > 0) {
    lines.push("## Other files", "");
    for (const entry of otherEntries) lines.push(`- ${otherFileLine(view, entry)}`);
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}
`;
}
function areaScope(view, area) {
  const nested = view.areas.filter((other) => other !== area && isWithin(other.dir, area.dir) && other.dir !== area.dir);
  const direct = nested.filter((other) => !nested.some((mid) => mid !== other && isWithin(other.dir, mid.dir)));
  const count = plural(area.files.length, "file");
  if (direct.length === 0) return `${count}.`;
  const links = direct.map((other) => `[${other.dir}/](${other.page})`).join(", ");
  return `${count}. Subdirectories with their own pages: ${links}.`;
}
function relationshipLines(view, area) {
  const format = (links) => links.slice(0, 10).map(({ area: other, imports }) => `[${other.dir || "(root)"}](${other.page}) (${imports})`).join(", ");
  const dependsOn = view.areaDependencies(area);
  const usedBy = view.areaDependents(area);
  const lines = [];
  if (dependsOn.length) lines.push(`- Depends on: ${format(dependsOn)}`);
  if (usedBy.length) lines.push(`- Used by: ${format(usedBy)}`);
  return lines.length ? [...lines, ""] : [];
}
function fileSection(view, entry) {
  const header2 = joinParts([entry.fileType, plural(entry.lines, "line"), entry.entryPoint ? "entry point" : void 0]);
  const lines = [`## ${code(entry.path)}`, "", joinParts([header2, view.describeFile(entry.path)])];
  if (entry.skipped) lines.push(`Not parsed: ${entry.skipped}.`);
  lines.push(...symbolLines(entry.symbols));
  lines.push(...importLines(entry));
  const importers = view.graph.importersOf(entry.path);
  if (importers.length > 0) {
    const shown = importers.slice(0, MAX_LISTED_IMPORTERS).map((edge) => code(edge.from)).join(", ");
    const more = importers.length > MAX_LISTED_IMPORTERS ? ` and ${importers.length - MAX_LISTED_IMPORTERS} more (see edges.tsv)` : "";
    lines.push(`Imported by: ${shown}${more}`);
  }
  lines.push("");
  return lines;
}
function symbolLines(symbols) {
  const members = /* @__PURE__ */ new Map();
  const topLevel = [];
  for (const symbol of symbols) {
    if (symbol.container) members.set(symbol.container, [...members.get(symbol.container) ?? [], symbol]);
    else topLevel.push(symbol);
  }
  const lines = [];
  const emit = (symbol, qualified, depth) => {
    const indent = "  ".repeat(depth);
    const heritage5 = symbol.extends?.length ? ` : ${symbol.extends.join(", ")}` : "";
    lines.push(`${indent}- L${symbol.line} ${symbol.exported ? "" : "private "}${symbol.kind} ${code(symbol.name)}${heritage5}`);
    const children = members.get(qualified) ?? [];
    const containers = children.filter((child) => members.has(`${qualified}.${child.name}`));
    const leaves = children.filter((child) => !containers.includes(child));
    if (leaves.length > 0) {
      const shown = leaves.slice(0, MAX_LISTED_MEMBERS).map((leaf) => `${leaf.name} L${leaf.line}`).join(", ");
      const more = leaves.length > MAX_LISTED_MEMBERS ? `, and ${leaves.length - MAX_LISTED_MEMBERS} more in symbols.tsv` : "";
      lines.push(`${indent}  - ${shown}${more}`);
    }
    for (const child of containers) emit(child, `${qualified}.${child.name}`, depth + 1);
  };
  const internal = topLevel.filter((symbol) => !symbol.exported && !members.has(symbol.name));
  for (const symbol of topLevel) if (!internal.includes(symbol)) emit(symbol, symbol.name, 0);
  if (internal.length > 0) {
    lines.push(`- Internal: ${internal.map((symbol) => `${symbol.kind} ${symbol.name} L${symbol.line}`).join(", ")}`);
  }
  return lines;
}
function importLines(entry) {
  const internal = /* @__PURE__ */ new Map();
  const external = /* @__PURE__ */ new Set();
  for (const imported of entry.imports) {
    if (imported.target) {
      const names = internal.get(imported.target) ?? /* @__PURE__ */ new Set();
      imported.names.filter((name2) => name2 !== "*" && name2 !== "default").forEach((name2) => names.add(name2));
      internal.set(imported.target, names);
    } else if (imported.external) {
      external.add(imported.external);
    }
  }
  const lines = [];
  if (internal.size > 0) {
    const list = [...internal].map(([target, names]) => names.size ? `${code(target)} (${[...names].join(", ")})` : code(target));
    lines.push(`Imports: ${list.join(", ")}`);
  }
  if (external.size > 0) lines.push(`Packages: ${[...external].sort().join(", ")}`);
  return lines;
}
function otherFileLine(view, entry) {
  const size = entry.lines > 0 ? plural(entry.lines, "line") : void 0;
  return joinParts([code(entry.path), entry.fileType ?? entry.category, size, view.describeFile(entry.path)]);
}

// src/render/graph-data.ts
var MAX_LISTED_SYMBOLS = 40;
function buildGraphData(view, mapDir) {
  const files = view.index.files.filter(isGraphFile);
  const indexByPath = new Map(files.map((entry, i2) => [entry.path, i2]));
  const chain = prefixChain(
    commonDirPrefix(files.map((entry) => entry.path)),
    files.filter((entry) => entry.language && entry.category !== "test").map((entry) => entry.path)
  );
  const prefix = chain[chain.length - 1];
  const groupOfFile = (path) => groupOf(path, chain);
  const groups = rankGroups(files.map((entry) => groupOfFile(entry.path)));
  const groupIndex = new Map(groups.map((name2, i2) => [name2, i2]));
  return {
    project: view.index.projectName,
    mapDir,
    prefix,
    groups,
    files: files.map((entry) => ({
      path: entry.path,
      group: groupIndex.get(groupOfFile(entry.path)),
      lines: entry.lines,
      type: entry.fileType ?? entry.category,
      category: entry.category,
      page: view.areaOf(entry.path)?.page ?? "_root.md",
      ...view.describeFile(entry.path) ? { summary: view.describeFile(entry.path) } : {},
      ...entry.entryPoint ? { entry: true } : {},
      symbols: listedSymbols(entry.symbols),
      symbolCount: entry.symbols.length
    })),
    links: graphLinks(view, files, indexByPath),
    externals: externalPackages(files),
    dirSummaries: Object.fromEntries(
      [...new Set(files.map((entry) => dirOf(entry.path)))].flatMap((dir) => ancestorsWithin(dir)).map((dir) => [dir, view.describeDir(dir)]).filter((pair) => Boolean(pair[1]))
    )
  };
}
function isGraphFile(entry) {
  return entry.language !== void 0 || entry.category === "code";
}
function graphLinks(view, files, indexByPath) {
  const filesByDir = /* @__PURE__ */ new Map();
  files.forEach((entry, i2) => {
    if (!entry.language) return;
    const dir = dirOf(entry.path);
    filesByDir.set(dir, [...filesByDir.get(dir) ?? [], i2]);
  });
  const links = [];
  for (const edge of view.graph.edges) {
    const from = indexByPath.get(edge.from);
    if (from === void 0) continue;
    const direct = indexByPath.get(edge.to);
    const targets = direct !== void 0 ? [direct] : filesByDir.get(edge.to) ?? [];
    for (const to of targets) if (to !== from) links.push([from, to, edge.names]);
  }
  return links;
}
function externalPackages(files) {
  const users = /* @__PURE__ */ new Map();
  files.forEach((entry, i2) => {
    for (const imported of entry.imports) {
      if (!imported.external) continue;
      if (!users.has(imported.external)) users.set(imported.external, /* @__PURE__ */ new Set());
      users.get(imported.external).add(i2);
    }
  });
  return [...users].map(([name2, set]) => ({ name: name2, files: [...set] })).sort((a, b) => b.files.length - a.files.length || a.name.localeCompare(b.name));
}
function listedSymbols(symbols) {
  const ordered = [...symbols.filter((s) => s.exported && !s.container), ...symbols.filter((s) => !s.exported && !s.container)];
  return ordered.slice(0, MAX_LISTED_SYMBOLS).map((s) => `${s.kind} ${s.name} ${s.line}`);
}
function commonDirPrefix(paths) {
  if (paths.length === 0) return "";
  let shared = dirOf(paths[0]).split("/").filter(Boolean);
  for (const path of paths) {
    const parts2 = dirOf(path).split("/");
    let i2 = 0;
    while (i2 < shared.length && parts2[i2] === shared[i2]) i2++;
    shared = shared.slice(0, i2);
  }
  return shared.join("/");
}
var DOMINANT_SHARE = 0.8;
function prefixChain(base, codePaths) {
  const chain = [base];
  let inside = codePaths.filter((path) => isUnder(path, base));
  while (inside.length > 0) {
    const current = chain[chain.length - 1];
    const counts = /* @__PURE__ */ new Map();
    for (const path of inside) {
      const segment = firstSegmentUnder(path, current);
      if (segment !== void 0) counts.set(segment, (counts.get(segment) ?? 0) + 1);
    }
    const [top, count] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? [];
    if (top === void 0 || count < inside.length * DOMINANT_SHARE || counts.size > 1 && count === inside.length) break;
    const next = current ? `${current}/${top}` : top;
    chain.push(next);
    inside = inside.filter((path) => isUnder(path, next));
  }
  return chain;
}
function isUnder(path, dir) {
  return dir === "" || path.startsWith(`${dir}/`);
}
function firstSegmentUnder(path, prefix) {
  const rest = prefix ? path.slice(prefix.length + 1) : path;
  const slash = rest.indexOf("/");
  return slash === -1 ? void 0 : rest.slice(0, slash);
}
function groupOf(path, chain) {
  const prefix = [...chain].reverse().find((dir) => isUnder(path, dir)) ?? "";
  return firstSegmentUnder(path, prefix) ?? "(root)";
}
function rankGroups(names) {
  const counts = /* @__PURE__ */ new Map();
  for (const name2 of names) counts.set(name2, (counts.get(name2) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name2]) => name2);
}
function ancestorsWithin(dir) {
  const dirs = [];
  for (let current = dir; current; current = dirOf(current)) dirs.push(current);
  return dirs;
}

// src/render/graph-page.ts
function embeddableJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
function escapeHtml(text) {
  return text.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}
function renderGraphPage(data, viewerScript2) {
  const title = `${escapeHtml(data.project)} \xB7 codebase graph`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="mfmap">
<title>${title}</title>
<style>${STYLES}</style>
</head>
<body>
<header class="bar">
  <div class="heading">
    <h1>${escapeHtml(data.project)}</h1>
    <span id="stats" class="stats"></span>
  </div>
  <div class="controls">
    <div class="search">
      <span class="search-field"><input id="search" type="search" placeholder="Search files, symbols, summaries" aria-label="Search the graph" autocomplete="off"><kbd>/</kbd></span>
      <span id="search-count" class="search-count" aria-live="polite"></span>
    </div>
    <div class="segmented" role="group" aria-label="Show">
      <button type="button" data-mode="files">Files</button>
      <button type="button" data-mode="folders">Folders</button>
    </div>
    <label id="depth-control" class="depth" hidden>Depth <input id="depth" type="range" min="1" max="6" step="1"> <span id="depth-value"></span></label>
    <label class="check"><input id="show-tests" type="checkbox"> Tests</label>
    <label class="check"><input id="show-packages" type="checkbox"> Packages</label>
    <label class="check"><input id="show-unconnected" type="checkbox"> Unconnected</label>
    <button type="button" id="view-toggle" class="ghost" aria-pressed="false">Table view</button>
    <button type="button" id="theme-toggle" class="ghost">Theme</button>
  </div>
</header>
<main class="layout">
  <div class="stage">
    <canvas id="graph" role="img" aria-label="Network graph of files and their imports. Use the table view for a keyboard-accessible list."></canvas>
    <div id="legend" class="legend"></div>
    <div id="tooltip" class="tooltip" hidden></div>
    <p class="hint">Scroll to zoom \xB7 drag to pan or move a node \xB7 click for details \xB7 double-click a folder to go deeper</p>
    <div id="table-view" class="table-view" hidden></div>
  </div>
  <aside id="panel" class="panel" hidden aria-live="polite"></aside>
</main>
<script type="application/json" id="map-data">${embeddableJson(data)}</script>
<script>${viewerScript2.replace(/<\/script/gi, "<\\/script")}</script>
</body>
</html>
`;
}
var STYLES = `
:root {
  color-scheme: light;
  --surface-1: #fcfcfb;
  --page: #f9f9f7;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --text-muted: #898781;
  --hairline: #e1e0d9;
  --edge: #c3c2b7;
  --ring: rgba(11, 11, 11, 0.10);
  --wash: rgba(11, 11, 11, 0.05);
  --series-1: #2a78d6; --series-2: #eb6834; --series-3: #1baf7a; --series-4: #eda100;
  --series-5: #e87ba4; --series-6: #008300; --series-7: #6250d6; --series-8: #a3a29d;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme="light"])) {
    color-scheme: dark;
    --surface-1: #1a1a19; --page: #0d0d0d; --text-primary: #f0efec; --text-secondary: #c3c2b7; --text-muted: #898781;
    --hairline: #2c2c2a; --edge: #605f58; --ring: rgba(255, 255, 255, 0.10); --wash: rgba(255, 255, 255, 0.06);
    --series-1: #3987e5; --series-2: #d95926; --series-3: #199e70; --series-4: #c98500;
    --series-5: #d55181; --series-6: #0ca30c; --series-7: #9085e9; --series-8: #6b6a65;
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --surface-1: #1a1a19; --page: #0d0d0d; --text-primary: #f0efec; --text-secondary: #c3c2b7; --text-muted: #898781;
  --hairline: #2c2c2a; --edge: #605f58; --ring: rgba(255, 255, 255, 0.10); --wash: rgba(255, 255, 255, 0.06);
  --series-1: #3987e5; --series-2: #d95926; --series-3: #199e70; --series-4: #c98500;
  --series-5: #d55181; --series-6: #0ca30c; --series-7: #9085e9; --series-8: #6b6a65;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
  display: flex; flex-direction: column; background: var(--page); color: var(--text-primary);
  font: 14px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif;
}
button, input { font: inherit; color: inherit; }
button { cursor: pointer; }
:focus-visible { outline: 2px solid var(--series-1); outline-offset: 2px; }
.bar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px 20px; padding: 10px 16px;
  background: var(--surface-1); border-bottom: 1px solid var(--hairline);
}
.heading { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
h1 { margin: 0; font-size: 16px; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stats { color: var(--text-secondary); font-size: 13px; white-space: nowrap; font-variant-numeric: tabular-nums; }
.controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; flex: 1; justify-content: flex-end; }
.search { display: flex; align-items: center; gap: 8px; }
.search input {
  width: min(300px, 70vw); padding: 6px 30px 6px 10px; border: 1px solid var(--hairline); border-radius: 8px;
  background: var(--page);
}
.search-field { position: relative; display: inline-flex; }
.search kbd {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font: 11px ui-monospace, monospace; color: var(--text-muted);
  border: 1px solid var(--hairline); border-radius: 4px; padding: 0 5px;
}
.search-count { color: var(--text-secondary); font-size: 12px; min-width: 64px; }
.segmented { display: inline-flex; border: 1px solid var(--hairline); border-radius: 8px; overflow: hidden; }
.segmented button { border: 0; background: transparent; padding: 5px 12px; }
.segmented button + button { border-left: 1px solid var(--hairline); }
.segmented button[aria-pressed="true"] { background: var(--text-primary); color: var(--surface-1); }
.depth, .check { display: inline-flex; align-items: center; gap: 6px; color: var(--text-secondary); white-space: nowrap; }
.depth[hidden] { display: none; }
.depth input { width: 90px; accent-color: var(--text-primary); }
.check input { accent-color: var(--text-primary); }
.ghost { border: 1px solid var(--hairline); background: transparent; border-radius: 8px; padding: 5px 10px; }
.ghost:hover, .link:hover, .legend-item:hover { background: var(--wash); }
.layout { position: relative; flex: 1; display: flex; min-height: 0; }
.stage { position: relative; flex: 1; min-width: 0; background: var(--surface-1); }
canvas { display: block; width: 100%; height: 100%; cursor: grab; touch-action: none; }
.legend {
  position: absolute; left: 12px; top: 12px; display: flex; flex-direction: column; gap: 2px; max-width: 260px;
  padding: 8px; background: color-mix(in srgb, var(--surface-1) 92%, transparent); border: 1px solid var(--hairline); border-radius: 10px;
}
.legend-item {
  display: flex; align-items: center; gap: 8px; border: 0; background: transparent; padding: 3px 6px; border-radius: 6px;
  text-align: left; color: var(--text-primary);
}
.legend-item.active { background: var(--wash); font-weight: 600; }
.legend-item.static { cursor: default; }
.legend-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.legend-count { color: var(--text-secondary); font-variant-numeric: tabular-nums; font-size: 12px; }
.legend-key { color: var(--text-secondary); font-size: 12px; padding: 6px 6px 2px; border-top: 1px solid var(--hairline); margin-top: 4px; }
.swatch { width: 10px; height: 10px; border-radius: 50%; flex: none; box-shadow: 0 0 0 1px var(--ring); }
.swatch.hollow { background: transparent !important; box-shadow: inset 0 0 0 1.5px var(--text-muted); }
.tooltip {
  position: absolute; left: 0; top: 0; max-width: 340px; padding: 8px 10px; pointer-events: none; z-index: 3;
  background: var(--surface-1); border: 1px solid var(--hairline); border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,.12);
}
.tip-stats { font-weight: 650; font-variant-numeric: tabular-nums; }
.tip-name { color: var(--text-secondary); font-size: 12px; word-break: break-all; }
.tip-summary { margin-top: 4px; }
.hint { position: absolute; right: 12px; bottom: 8px; margin: 0; color: var(--text-muted); font-size: 12px; text-align: right; }
.table-view { position: absolute; inset: 0; overflow: auto; background: var(--surface-1); padding: 12px 16px; z-index: 2; }
.table-view[hidden] { display: none; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th { text-align: left; position: sticky; top: 0; background: var(--surface-1); border-bottom: 1px solid var(--hairline); }
th .sort { border: 0; background: transparent; padding: 6px 8px; font-weight: 600; color: var(--text-secondary); }
td { padding: 4px 8px; border-bottom: 1px solid var(--hairline); }
td.num { text-align: right; font-variant-numeric: tabular-nums; }
.link {
  display: inline-flex; align-items: center; gap: 8px; border: 0; background: transparent; padding: 2px 4px; border-radius: 4px;
  text-align: left; word-break: break-all;
}
.panel {
  width: 360px; flex: none; overflow: auto; padding: 16px; background: var(--surface-1); border-left: 1px solid var(--hairline);
}
.panel[hidden] { display: none; }
.panel-close { float: right; border: 1px solid var(--hairline); background: transparent; border-radius: 6px; padding: 2px 8px; font-size: 12px; }
.panel-kind { color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
.panel-title { margin: 4px 0 8px; font-size: 15px; word-break: break-all; }
.panel-summary { margin: 0 0 6px; }
.panel-summary.empty { color: var(--text-muted); font-style: italic; }
.panel-stats { margin: 0 0 10px; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
.panel-actions { display: flex; gap: 12px; margin-bottom: 8px; }
.panel-actions a { color: var(--series-1); }
.panel h3 { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-secondary); margin: 16px 0 6px; }
.panel ul { list-style: none; margin: 0; padding: 0; }
.symbols li { display: flex; gap: 8px; padding: 2px 0; font-size: 13px; }
.symbol-kind { color: var(--text-muted); width: 64px; flex: none; }
.symbol-name { flex: 1; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; word-break: break-all; }
.symbol-line { color: var(--text-muted); font-variant-numeric: tabular-nums; }
.node-list li { font-size: 13px; }
.plain { color: var(--text-secondary); }
@media (max-width: 760px) {
  .controls { justify-content: flex-start; }
  .panel { position: absolute; inset: auto 0 0 0; width: auto; max-height: 55%; border-left: 0; border-top: 1px solid var(--hairline); z-index: 4; }
  .legend { max-width: 180px; font-size: 12px; }
  .hint { display: none; }
}
`;

// src/render/map-page.ts
var MAX_TREE_LINES = 160;
var MAX_TREE_DEPTH = 4;
var KEY_FILE_COUNT = 15;
var MAX_ROOT_FILES = 40;
var MAX_DEPENDENCIES_PER_MANIFEST = 60;
function renderMapPage(view, options) {
  const sections = [
    header(view, options),
    howToFind(options.mapDir),
    layout(view),
    entryPoints(view),
    keyFiles(view),
    areaDependencies(view),
    externalDependencies(view),
    keepingCurrent(view)
  ];
  return `${sections.filter(Boolean).join("\n\n").trimEnd()}
`;
}
function header(view, options) {
  const files = view.index.files;
  const byLanguage = /* @__PURE__ */ new Map();
  for (const entry of files) if (entry.language) byLanguage.set(entry.fileType, (byLanguage.get(entry.fileType) ?? 0) + 1);
  const languages = [...byLanguage].sort((a, b) => b[1] - a[1]).map(([name2, count]) => `${name2} ${count}`).join(", ");
  const symbols = files.reduce((sum, entry) => sum + entry.symbols.length, 0);
  return [
    `# Codebase map: ${view.index.projectName}`,
    "",
    `> Generated by ${options.generator}. Do not edit by hand: run \`mfmap update\` after changes (see "Keeping this map current").`,
    "",
    joinParts([
      plural(files.length, "file"),
      languages ? `parsed: ${languages}` : void 0,
      plural(symbols, "symbol"),
      plural(view.graph.edges.length, "internal import")
    ])
  ].join("\n");
}
function howToFind(mapDir) {
  const at = (name2) => code(mapDir ? `${mapDir}/${name2}` : name2);
  return [
    "## How to find things",
    "",
    "| Looking for | Do this |",
    "| --- | --- |",
    `| Where a feature or concern lives | Scan **Layout** below, then open the linked area page in ${at("modules/")} |`,
    `| A file by keyword | ${code(`grep -i 'keyword' ${mapDir ? `${mapDir}/` : ""}files.tsv`)} (path, category, type, lines, area page, summary) |`,
    `| Where a symbol is defined | ${code(`grep -P '^Name\\t' ${mapDir ? `${mapDir}/` : ""}symbols.tsv`)} (name, kind, path, line, end line, container, visibility, extends) |`,
    `| What a file imports, and who imports it | The file's section on its area page, or ${code(`grep -P '\\tpath/to/file\\t' ${mapDir ? `${mapDir}/` : ""}edges.tsv`)} |`,
    `| Who uses a third-party package | ${code(`grep -P '\\tpackage-name\\texternal' ${mapDir ? `${mapDir}/` : ""}edges.tsv`)} |`,
    `| A picture of how files and folders connect | Open ${at("graph.html")} in a browser (interactive network graph) |`,
    `| Everything, machine-readable | ${at("index.json")} |`
  ].join("\n");
}
function layout(view) {
  const counts = /* @__PURE__ */ new Map();
  for (const entry of view.index.files) {
    for (const dir of ancestorDirs(entry.path)) counts.set(dir, (counts.get(dir) ?? 0) + 1);
  }
  const dirs = [...counts.keys()].filter((dir) => dir !== "").sort();
  let depth = MAX_TREE_DEPTH;
  while (depth > 1 && dirs.filter((dir) => dir.split("/").length <= depth).length > MAX_TREE_LINES) depth--;
  const lines = ["## Layout", ""];
  for (const dir of dirs.filter((d) => d.split("/").length <= depth)) {
    const indent = "  ".repeat(dir.split("/").length - 1);
    const page = view.areaOf(dir)?.page;
    const name2 = dir.split("/").pop();
    lines.push(
      `${indent}- ${joinParts([code(`${name2}/`), plural(counts.get(dir), "file"), view.describeDir(dir), page && `[page](modules/${page})`])}`
    );
  }
  const rootFiles = view.index.files.filter((entry) => dirOf(entry.path) === "").map((entry) => entry.path);
  if (rootFiles.length > 0) {
    const shown = rootFiles.slice(0, MAX_ROOT_FILES).map(code).join(", ");
    const more = rootFiles.length > MAX_ROOT_FILES ? `, and ${rootFiles.length - MAX_ROOT_FILES} more` : "";
    lines.push("", `Root files ([page](modules/_root.md)): ${shown}${more}`);
  }
  return lines.join("\n");
}
function entryPoints(view) {
  const declared = /* @__PURE__ */ new Map();
  for (const manifest of view.index.manifests) {
    for (const entry of manifest.entryPoints) {
      const file = sourceFileFor(entry, view.entries);
      if (file && !declared.has(file)) declared.set(file, `declared in ${manifest.path}`);
    }
  }
  for (const entry of view.index.files) {
    if (entry.entryPoint && entry.category !== "test" && !declared.has(entry.path)) declared.set(entry.path, "program entry");
  }
  if (declared.size === 0) return void 0;
  const lines = [...declared].sort(([a], [b]) => a.localeCompare(b)).map(
    ([path, reason]) => `- ${joinParts([code(path), reason, view.describeFile(path)])}`
  );
  return ["## Entry points", "", ...lines].join("\n");
}
function sourceFileFor(entry, entries) {
  const stem = entry.replace(/^\.\//, "").replace(/\.(c|m)?js$/, "");
  const candidates = [entry, stem, stem.replace(/(^|\/)(dist|lib|build|out)\//, "$1src/")].flatMap((base) => [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.mjs`
  ]);
  return candidates.find((candidate) => entries.has(candidate));
}
function keyFiles(view) {
  const ranked = view.index.files.filter((entry) => entry.category === "code").map((entry) => ({ path: entry.path, importers: new Set(view.graph.importersOf(entry.path).map((e) => e.from)).size })).filter(({ importers }) => importers > 1).sort((a, b) => b.importers - a.importers || a.path.localeCompare(b.path)).slice(0, KEY_FILE_COUNT);
  if (ranked.length === 0) return void 0;
  const lines = ranked.map(
    ({ path, importers }, i2) => `${i2 + 1}. ${joinParts([code(path), `imported by ${plural(importers, "file")}`, view.describeFile(path)])}`
  );
  return ["## Key files (most depended on)", "", ...lines].join("\n");
}
function areaDependencies(view) {
  const lines = view.areas.map((area) => ({ area, links: view.areaDependencies(area) })).filter(({ links }) => links.length > 0).map(({ area, links }) => {
    const targets = links.slice(0, 8).map((link) => `${link.area.dir || "(root)"} (${link.imports})`).join(", ");
    return `- [${area.dir || "(root)"}](modules/${area.page}) imports from ${targets}`;
  });
  if (lines.length === 0) return void 0;
  return ["## How areas depend on each other", "", "Counts are file-to-file imports.", "", ...lines].join("\n");
}
function externalDependencies(view) {
  const usage = externalUsage(view.index.files);
  const declared = /* @__PURE__ */ new Set();
  const sections = [];
  for (const manifest of view.index.manifests) {
    if (manifest.dependencies.length === 0) continue;
    manifest.dependencies.forEach((dep) => declared.add(normalizePackage(dep.name)));
    sections.push(manifestSection(manifest, usage));
  }
  const undeclared = [...usage].filter(([name2]) => !declared.has(normalizePackage(name2))).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 40).map(([name2, files]) => `${name2} (${files})`);
  if (undeclared.length > 0) {
    sections.push(`Imported packages not matched to a manifest entry (file counts): ${undeclared.join(", ")}`);
  }
  if (sections.length === 0) return void 0;
  return ["## External dependencies", "", ...sections.flatMap((section) => [section, ""])].join("\n").trimEnd();
}
function manifestSection(manifest, usage) {
  const describe = (dev2) => manifest.dependencies.filter((dep) => Boolean(dep.dev) === dev2).slice(0, MAX_DEPENDENCIES_PER_MANIFEST).map((dep) => {
    const used = usage.get(dep.name) ?? usageByNormalizedName(usage, dep.name);
    return joinParts([dep.version ? `${dep.name} ${dep.version}` : dep.name, used ? plural(used, "file") : void 0]);
  });
  const runtime = describe(false);
  const dev = describe(true);
  const title = `**${code(manifest.path)}** (${manifest.ecosystem}${manifest.name ? `, ${code(manifest.name)}` : ""})`;
  return [title, runtime.length ? `- Runtime: ${runtime.join(", ")}` : "", dev.length ? `- Dev: ${dev.join(", ")}` : ""].filter(Boolean).join("\n");
}
function externalUsage(files) {
  const usage = /* @__PURE__ */ new Map();
  for (const entry of files) {
    for (const name2 of new Set(entry.imports.map((i2) => i2.external).filter(Boolean))) {
      usage.set(name2, (usage.get(name2) ?? 0) + 1);
    }
  }
  return usage;
}
function normalizePackage(name2) {
  return name2.toLowerCase().replace(/[-_.]+/g, "-");
}
function usageByNormalizedName(usage, name2) {
  const wanted = normalizePackage(name2);
  return [...usage].find(([used]) => normalizePackage(used) === wanted)?.[1];
}
function keepingCurrent(view) {
  const { files, dirs } = view.pending;
  const pending = files.length + dirs.length > 0 ? `Summaries still to write: ${plural(files.length, "file")}, ${plural(dirs.length, "directory", "directories")}. Run \`mfmap summaries pending\` to list them.` : "All summaries are current.";
  return [
    "## Keeping this map current",
    "",
    "- `mfmap update` re-parses only files whose content changed and rewrites the map. Agent hooks and `mfmap watch` run it automatically when installed.",
    "- Summaries are written by an agent and tied to each file's content hash, so a changed file is flagged until it is re-summarized.",
    `- ${pending}`
  ].join("\n");
}

// src/map/areas.ts
var MIN_AREA_FILES = 12;
function planAreas(paths, fileLimit) {
  const areas = [];
  splitDirectory("", [...paths].sort(), fileLimit, areas);
  return areas.sort((a, b) => a.dir.localeCompare(b.dir));
}
function splitDirectory(dir, paths, fileLimit, areas) {
  const bySubdir = /* @__PURE__ */ new Map();
  const kept = [];
  for (const path of paths) {
    const rest = dir === "" ? path : path.slice(dir.length + 1);
    const slash = rest.indexOf("/");
    if (slash === -1) {
      kept.push(path);
      continue;
    }
    const subdir = dir === "" ? rest.slice(0, slash) : `${dir}/${rest.slice(0, slash)}`;
    bySubdir.set(subdir, [...bySubdir.get(subdir) ?? [], path]);
  }
  for (const [subdir, files] of bySubdir) {
    if (files.length > fileLimit) splitDirectory(subdir, files, fileLimit, areas);
    else if (files.length >= MIN_AREA_FILES) areas.push(areaFor(subdir, files));
    else kept.push(...files);
  }
  if (kept.length > 0 || dir === "") areas.push(areaFor(dir, kept.sort()));
}
function areaFor(dir, files) {
  return { dir, page: dir === "" ? "_root.md" : `${dir.replaceAll("/", "--")}.md`, files };
}
function areaIndex(areas) {
  const index = /* @__PURE__ */ new Map();
  for (const area of areas) for (const file of area.files) index.set(file, area);
  return index;
}
function areaOfDir(dir, areas) {
  return areas.filter((area) => isWithin(dir, area.dir)).sort((a, b) => b.dir.length - a.dir.length).find((area) => area.files.some((file) => isWithin(file, dir)));
}

// src/map/dependency-graph.ts
var DependencyGraph = class {
  edges;
  importers = /* @__PURE__ */ new Map();
  constructor(entries) {
    this.edges = collectEdges(entries);
    for (const edge of this.edges) this.importers.set(edge.to, [...this.importers.get(edge.to) ?? [], edge]);
  }
  /** Edges into a file, including package-level edges into its directory. */
  importersOf(path) {
    const direct = this.importers.get(path) ?? [];
    const viaPackage = (this.importers.get(dirOf(path)) ?? []).filter((edge) => dirOf(edge.from) !== dirOf(path));
    return [...direct, ...viaPackage];
  }
};
function collectEdges(entries) {
  const edges = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    for (const imported of entry.imports) {
      if (!imported.target) continue;
      const key = `${entry.path}\0${imported.target}`;
      const existing = edges.get(key);
      if (existing) existing.names = [.../* @__PURE__ */ new Set([...existing.names, ...imported.names])];
      else edges.set(key, { from: entry.path, to: imported.target, names: [...imported.names] });
    }
  }
  return [...edges.values()];
}

// src/render/map-view.ts
var MapView = class {
  index;
  summaries;
  graph;
  areas;
  entries;
  pending;
  areaByFile;
  areaByDir = /* @__PURE__ */ new Map();
  constructor(index, summaries, areaFileLimit) {
    this.index = index;
    this.summaries = summaries;
    this.graph = new DependencyGraph(index.files);
    this.areas = planAreas(index.files.map((f) => f.path), areaFileLimit);
    this.areaByFile = areaIndex(this.areas);
    this.entries = new Map(index.files.map((entry) => [entry.path, entry]));
    this.pending = summaries.pending();
  }
  /** The area owning a file, or for a package-level target directory, the area holding its files. */
  areaOf(path) {
    const byFile = this.areaByFile.get(path);
    if (byFile) return byFile;
    if (!this.areaByDir.has(path)) this.areaByDir.set(path, areaOfDir(path, this.areas));
    return this.areaByDir.get(path);
  }
  /** Summary text for display, marked when the file changed after it was written. */
  describeFile(path) {
    const summary = this.summaries.fileSummary(path);
    return summary && (summary.stale ? `${summary.text} (summary may be outdated)` : summary.text);
  }
  describeDir(dir) {
    const summary = this.summaries.dirSummary(dir);
    return summary && (summary.stale ? `${summary.text} (summary may be outdated)` : summary.text);
  }
  /** Areas this area imports from, most imports first. */
  areaDependencies(area) {
    return this.countAreas(
      this.graph.edges.filter((edge) => this.areaOf(edge.from) === area),
      (edge) => this.areaOf(edge.to),
      area
    );
  }
  /** Areas that import from this area, most imports first. */
  areaDependents(area) {
    return this.countAreas(
      this.graph.edges.filter((edge) => this.areaOf(edge.to) === area),
      (edge) => this.areaOf(edge.from),
      area
    );
  }
  countAreas(edges, pick, self2) {
    const counts = /* @__PURE__ */ new Map();
    for (const edge of edges) {
      const other = pick(edge);
      if (other && other !== self2) counts.set(other, (counts.get(other) ?? 0) + 1);
    }
    return [...counts].map(([area, imports]) => ({ area, imports })).sort((a, b) => b.imports - a.imports || a.area.dir.localeCompare(b.area.dir));
  }
};

// src/render/tables.ts
function renderSymbolsTable(view) {
  const rows = view.index.files.flatMap(
    (entry) => entry.symbols.map((symbol) => [
      symbol.name,
      symbol.kind,
      entry.path,
      symbol.line,
      symbol.endLine,
      symbol.container,
      symbol.exported ? "exported" : "private",
      symbol.extends?.join(", ")
    ])
  );
  return tsv(["name", "kind", "path", "line", "end_line", "container", "visibility", "extends"], rows);
}
function renderFilesTable(view) {
  const rows = view.index.files.map((entry) => [
    entry.path,
    entry.category,
    entry.fileType,
    entry.lines,
    view.areaOf(entry.path)?.page,
    view.describeFile(entry.path)
  ]);
  return tsv(["path", "category", "type", "lines", "area_page", "summary"], rows);
}
function renderEdgesTable(view) {
  const rows = [];
  for (const entry of view.index.files) {
    const externals = /* @__PURE__ */ new Map();
    for (const imported of entry.imports) {
      if (imported.external) {
        const names = externals.get(imported.external) ?? /* @__PURE__ */ new Set();
        imported.names.forEach((name2) => names.add(name2));
        externals.set(imported.external, names);
      }
    }
    for (const [name2, names] of externals) rows.push([entry.path, name2, "external", [...names].join(", ")]);
  }
  for (const edge of view.graph.edges) {
    const kind = view.entries.has(edge.to) ? "file" : "package";
    rows.push([edge.from, edge.to, kind, edge.names.join(", ")]);
  }
  rows.sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1])));
  return tsv(["from", "to", "kind", "names"], rows);
}

// src/render/viewer-script.ts
import { existsSync as existsSync5, readFileSync as readFileSync4 } from "node:fs";
import { dirname as dirname4, join as join5 } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
var cached;
function viewerScript() {
  cached ??= loadViewerScript();
  return cached;
}
async function loadViewerScript() {
  const here = dirname4(fileURLToPath2(import.meta.url));
  const bundled = join5(here, "viewer.js");
  if (existsSync5(bundled)) return readFileSync4(bundled, "utf8");
  const { build } = await import("esbuild");
  const result = await build({
    entryPoints: [join5(here, "..", "viewer", "main.ts")],
    bundle: true,
    format: "iife",
    minify: true,
    target: "es2020",
    write: false,
    legalComments: "none"
  });
  return result.outputFiles[0].text;
}

// src/render/write-map.ts
var MAP_PAGE = "MAP.md";
var GRAPH_PAGE = "graph.html";
var AREA_DIR = "modules";
async function writeMapOutputs(folder, index, summaries) {
  const view = new MapView(index, summaries, folder.config.areaFileLimit);
  const outputs = /* @__PURE__ */ new Map([
    [MAP_PAGE, renderMapPage(view, { mapDir: folder.relativeDir, generator: GENERATOR_NAME })],
    ["symbols.tsv", renderSymbolsTable(view)],
    ["files.tsv", renderFilesTable(view)],
    ["edges.tsv", renderEdgesTable(view)],
    [SUMMARIES_FILE, `${JSON.stringify(summaries.toJSON(), null, 2)}
`],
    [GRAPH_PAGE, renderGraphPage(buildGraphData(view, folder.relativeDir), await viewerScript())]
  ]);
  for (const area of view.areas) outputs.set(`${AREA_DIR}/${area.page}`, renderAreaPage(view, area));
  const written = [...outputs].filter(([name2, content]) => folder.writeIfChanged(name2, content)).map(([name2]) => name2);
  const pages = new Set(view.areas.map((area) => area.page));
  const removed = folder.pruneDir(AREA_DIR, pages).map((page) => `${AREA_DIR}/${page} (removed)`);
  return [...written, ...removed];
}

// src/scan/list-files.ts
var import_ignore = __toESM(require_ignore(), 1);
import { execFileSync as execFileSync2 } from "node:child_process";
import { readdirSync as readdirSync2, readFileSync as readFileSync5, statSync } from "node:fs";
import { join as join6 } from "node:path";
var ALWAYS_EXCLUDED = [
  ".git/",
  "node_modules/",
  ".venv/",
  "venv/",
  "__pycache__/",
  ".mypy_cache/",
  ".pytest_cache/",
  ".tox/",
  ".next/",
  ".nuxt/",
  ".turbo/",
  ".svelte-kit/",
  ".gradle/",
  ".idea/",
  ".vs/",
  "DerivedData/",
  "Pods/",
  ".build/",
  ".DS_Store",
  ".claude/settings.local.json"
];
var UNTRACKED_BUILD_DIRS = ["dist/", "build/", "out/", "target/", "coverage/", "bin/", "obj/", "vendor/"];
function listProjectFiles(options) {
  const filter = (0, import_ignore.default)().add(ALWAYS_EXCLUDED).add(options.exclude);
  const fromGit = gitFiles(options.root);
  const paths = fromGit ?? walkFiles(options.root, (0, import_ignore.default)().add(UNTRACKED_BUILD_DIRS).add(readGitignore(options.root)));
  return paths.filter((path) => !filter.ignores(path) && isRegularFile(join6(options.root, path))).sort();
}
function isRegularFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}
function gitFiles(root) {
  try {
    const output = execFileSync2("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"]
    });
    return [...new Set(output.split("\0").filter(Boolean))];
  } catch {
    return void 0;
  }
}
function readGitignore(root) {
  try {
    return readFileSync5(join6(root, ".gitignore"), "utf8");
  } catch {
    return "";
  }
}
function walkFiles(root, ignored) {
  const files = [];
  const visit = (relativeDir) => {
    for (const entry of readdirSync2(join6(root, relativeDir), { withFileTypes: true })) {
      const path = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!ignored.ignores(`${path}/`) && !ALWAYS_EXCLUDED.includes(`${entry.name}/`)) visit(path);
      } else if (entry.isFile() && !ignored.ignores(path)) {
        files.push(path);
      }
    }
  };
  visit("");
  return files;
}

// src/map/analyze-file.ts
import { createHash as createHash2 } from "node:crypto";

// src/languages/syntax.ts
var CONTAINER_KINDS = /* @__PURE__ */ new Set([
  "class",
  "interface",
  "struct",
  "trait",
  "impl",
  "module",
  "namespace",
  "protocol",
  "extension",
  "object",
  "enum",
  "record"
]);
function collectSymbols(root, classify9) {
  const symbols = [];
  const visit = (node, container) => {
    const found = classify9(node);
    if (found === "skip") return;
    if (found === void 0) {
      for (const child of node.namedChildren) visit(child, container);
      return;
    }
    const span = found.span ?? node;
    const kind = found.kind === "function" && container ? "method" : found.kind;
    symbols.push({
      name: found.name,
      kind,
      line: span.startPosition.row + 1,
      endLine: span.endPosition.row + 1,
      exported: found.exported,
      ...container ? { container } : {},
      ...found.extends?.length ? { extends: found.extends } : {}
    });
    if (CONTAINER_KINDS.has(kind)) {
      const qualified = container ? `${container}.${found.name}` : found.name;
      for (const child of node.namedChildren) visit(child, qualified);
    }
  };
  visit(root, void 0);
  return symbols;
}
function forEachNode(root, enter) {
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (enter(node) === false) continue;
    const children = node.namedChildren;
    for (let i2 = children.length - 1; i2 >= 0; i2--) stack.push(children[i2]);
  }
}
function lineOf(node) {
  return node.startPosition.row + 1;
}
function unquote(text) {
  return text.replace(/^[rbuf]*(['"`]{1,3})([\s\S]*)\1$/i, "$2");
}

// src/languages/csharp.ts
var TYPE_KINDS = {
  class_declaration: "class",
  struct_declaration: "struct",
  interface_declaration: "interface",
  enum_declaration: "enum",
  record_declaration: "record",
  record_struct_declaration: "record",
  delegate_declaration: "type"
};
var NAMESPACE_TYPES = /* @__PURE__ */ new Set(["namespace_declaration", "file_scoped_namespace_declaration"]);
var METHOD_TYPES = /* @__PURE__ */ new Set(["method_declaration", "constructor_declaration"]);
var SKIPPED_TYPES = /* @__PURE__ */ new Set([
  "property_declaration",
  "field_declaration",
  "event_field_declaration",
  "event_declaration",
  "indexer_declaration",
  "operator_declaration",
  "conversion_operator_declaration",
  "destructor_declaration",
  "global_statement"
]);
function extractCSharp(root) {
  const packageName = namespaceOf(root);
  return {
    symbols: collectSymbols(root, classify),
    imports: collectImports(root),
    ...packageName ? { packageName } : {},
    ...isEntryPoint(root) ? { entryPoint: true } : {}
  };
}
function classify(node) {
  const name2 = node.childForFieldName("name")?.text;
  if (NAMESPACE_TYPES.has(node.type)) return name2 ? { kind: "namespace", name: name2, exported: true } : void 0;
  const typeKind = TYPE_KINDS[node.type];
  if (typeKind) return name2 ? { kind: typeKind, name: name2, exported: isPublic(node), extends: heritage(node) } : void 0;
  if (METHOD_TYPES.has(node.type)) return name2 ? { kind: "method", name: name2, exported: isPublic(node) } : void 0;
  return SKIPPED_TYPES.has(node.type) ? "skip" : void 0;
}
function modifiersOf(node) {
  return new Set(node.namedChildren.filter((child) => child.type === "modifier").map((child) => child.text));
}
function isPublic(node) {
  if (node.parent?.parent?.type === "interface_declaration") return true;
  return modifiersOf(node).has("public");
}
function heritage(node) {
  const bases = node.namedChildren.find((child) => child.type === "base_list");
  return (bases?.namedChildren ?? []).map(
    (base) => base.type === "primary_constructor_base_type" ? base.namedChildren[0]?.text ?? base.text : base.text
  );
}
function namespaceOf(root) {
  let first;
  forEachNode(root, (node) => {
    if (NAMESPACE_TYPES.has(node.type)) first ??= node.childForFieldName("name")?.text;
  });
  return first;
}
function isEntryPoint(root) {
  if (root.namedChildren.some((child) => child.type === "global_statement")) return true;
  let found = false;
  forEachNode(root, (node) => {
    if (node.type !== "method_declaration") return;
    if (node.childForFieldName("name")?.text === "Main" && modifiersOf(node).has("static")) found = true;
    return false;
  });
  return found;
}
function collectImports(root) {
  const imports = [];
  forEachNode(root, (node) => {
    if (node.type !== "using_directive") return;
    const namespace = node.namedChildren.filter((child) => child.type !== "name_equals").at(-1);
    if (!namespace) return false;
    const alias = node.namedChildren.find((child) => child.type === "name_equals")?.namedChildren[0]?.text;
    imports.push({ specifier: namespace.text, names: alias ? [alias] : [], line: lineOf(node) });
    return false;
  });
  return imports;
}
var csharp = {
  id: "csharp",
  displayName: "C#",
  grammar: "c_sharp",
  extensions: [".cs"],
  ecosystem: "dotnet",
  extract: extractCSharp
};
var PLATFORM_ROOTS = /* @__PURE__ */ new Set(["System", "Microsoft"]);
var dotnetResolver = (project) => {
  const dirsByNamespace = /* @__PURE__ */ new Map();
  for (const entry of project.entries.values()) {
    if (entry.language !== "csharp" || !entry.packageName) continue;
    const dirs = dirsByNamespace.get(entry.packageName) ?? /* @__PURE__ */ new Set();
    dirsByNamespace.set(entry.packageName, dirs.add(dirOf(entry.path)));
  }
  const shallowest = (dirs) => [...dirs].sort((a, b) => depthOf(a) - depthOf(b) || a.localeCompare(b))[0];
  return {
    resolve(_fromPath, imported) {
      const namespaces = [imported.specifier, imported.specifier.slice(0, imported.specifier.lastIndexOf("."))];
      for (const namespace of namespaces) {
        const dirs = dirsByNamespace.get(namespace);
        if (dirs) return { target: shallowest(dirs) };
      }
      const segments = imported.specifier.split(".");
      const root = segments.slice(0, 2).join(".");
      return PLATFORM_ROOTS.has(segments[0]) ? { builtin: root } : { external: root };
    }
  };
};
function depthOf(dir) {
  return dir === "" ? 0 : dir.split("/").length;
}

// src/languages/go.ts
function extract(root) {
  const packageName = packageNameOf(root);
  const symbols = [...collectSymbols(root, classify2), ...collectDeclarations(root)].sort(
    (a, b) => a.line - b.line
  );
  const hasMain = symbols.some((s) => s.kind === "function" && s.name === "main");
  return {
    symbols,
    imports: collectImports2(root),
    ...packageName ? { packageName } : {},
    ...packageName === "main" && hasMain ? { entryPoint: true } : {}
  };
}
function packageNameOf(root) {
  const clause = root.namedChildren.find((child) => child.type === "package_clause");
  return clause?.namedChildren[0]?.text;
}
function isExported(name2) {
  return new RegExp("^\\p{Lu}", "u").test(name2);
}
function classify2(node) {
  const name2 = node.childForFieldName("name")?.text;
  switch (node.type) {
    case "function_declaration":
      return name2 ? { kind: "function", name: name2, exported: isExported(name2) } : void 0;
    case "type_spec":
      return name2 ? classifyTypeSpec(node, name2) : void 0;
    case "type_alias":
      return name2 ? { kind: "type", name: name2, exported: isExported(name2) } : void 0;
    case "method_spec":
      return name2 ? { kind: "method", name: name2, exported: isExported(name2) } : void 0;
    case "method_declaration":
    case "const_declaration":
    case "var_declaration":
      return "skip";
    default:
      return void 0;
  }
}
function classifyTypeSpec(node, name2) {
  const exported = isExported(name2);
  const body2 = node.childForFieldName("type");
  if (body2?.type === "struct_type") return { kind: "struct", name: name2, exported, extends: embeddedFields(body2) };
  if (body2?.type === "interface_type") return { kind: "interface", name: name2, exported, extends: embeddedInterfaces(body2) };
  return { kind: "type", name: name2, exported };
}
function embeddedFields(struct) {
  const fields = struct.namedChildren.find((child) => child.type === "field_declaration_list");
  const embedded = (fields?.namedChildren ?? []).filter(
    (field) => field.type === "field_declaration" && !field.childForFieldName("name")
  );
  return embedded.flatMap((field) => field.childForFieldName("type")?.text ?? []);
}
var EMBEDDABLE_TYPES = /* @__PURE__ */ new Set(["type_identifier", "qualified_type", "generic_type"]);
function embeddedInterfaces(contract) {
  return contract.namedChildren.flatMap((element) => {
    if (element.type !== "constraint_elem" && element.type !== "type_elem") return [];
    const [only, ...rest] = element.namedChildren;
    return only && rest.length === 0 && EMBEDDABLE_TYPES.has(only.type) ? [only.text] : [];
  });
}
function collectDeclarations(root) {
  return root.namedChildren.flatMap((node) => {
    if (node.type === "method_declaration") return methodOf(node);
    if (node.type === "const_declaration" || node.type === "var_declaration") return variablesOf(node);
    return [];
  });
}
function methodOf(node) {
  const name2 = node.childForFieldName("name")?.text;
  const receiver = receiverTypeName(node);
  if (!name2) return [];
  return [
    {
      name: name2,
      kind: "method",
      line: lineOf(node),
      endLine: node.endPosition.row + 1,
      exported: isExported(name2),
      ...receiver ? { container: receiver } : {}
    }
  ];
}
function receiverTypeName(method) {
  const parameter = method.childForFieldName("receiver")?.namedChildren[0];
  const type = parameter?.childForFieldName("type");
  return type ? baseTypeName(type) : void 0;
}
function baseTypeName(type) {
  if (type.type === "pointer_type" && type.namedChildren[0]) return baseTypeName(type.namedChildren[0]);
  if (type.type === "generic_type") {
    const generic = type.childForFieldName("type");
    if (generic) return baseTypeName(generic);
  }
  return type.text;
}
function variablesOf(declaration) {
  const symbols = [];
  forEachNode(declaration, (node) => {
    if (node.type !== "const_spec" && node.type !== "var_spec") return true;
    for (const nameNode of node.childrenForFieldName("name").filter((child) => child.isNamed)) {
      if (nameNode.text === "_") continue;
      symbols.push({
        name: nameNode.text,
        kind: "variable",
        line: lineOf(node),
        endLine: node.endPosition.row + 1,
        exported: isExported(nameNode.text)
      });
    }
    return false;
  });
  return symbols;
}
function collectImports2(root) {
  const imports = [];
  forEachNode(root, (node) => {
    if (node.type !== "import_spec") return true;
    const path = node.childForFieldName("path");
    const alias = node.childForFieldName("name")?.text;
    if (path) imports.push({ specifier: unquote(path.text), names: alias ? [alias] : [], line: lineOf(node) });
    return false;
  });
  return imports;
}
var go = {
  id: "go",
  displayName: "Go",
  grammar: "go",
  extensions: [".go"],
  ecosystem: "go",
  extract
};
var EXTERNAL_PATH_SEGMENTS = 3;
var goResolver = (project) => {
  const modules = readModules(project).sort((a, b) => b.path.length - a.path.length);
  const required = modules.flatMap((module2) => module2.required).sort((a, b) => b.length - a.length);
  return {
    resolve: (_fromPath, imported) => resolveImport(imported.specifier, modules, required, project)
  };
};
function resolveImport(importPath, modules, required, project) {
  const own = modules.find((module2) => isPathUnder(importPath, module2.path));
  if (own) return resolveInModule(importPath, own, project);
  if (!importPath.split("/")[0].includes(".")) return { builtin: importPath };
  const dependency = required.find((module2) => isPathUnder(importPath, module2));
  return { external: dependency ?? importPath.split("/").slice(0, EXTERNAL_PATH_SEGMENTS).join("/") };
}
function resolveInModule(importPath, module2, project) {
  const remainder = importPath.slice(module2.path.length + 1);
  const dir = joinRepoPath(module2.dir, remainder);
  return dir !== void 0 && project.dirs.has(dir) ? { target: dir } : { unresolved: true };
}
function isPathUnder(importPath, modulePath) {
  return importPath === modulePath || importPath.startsWith(`${modulePath}/`);
}
function readModules(project) {
  const modules = [];
  for (const file of project.files) {
    if (file !== "go.mod" && !file.endsWith("/go.mod")) continue;
    const parsed = parseGoMod(project.readText(file) ?? "");
    if (parsed.path) modules.push({ dir: dirOf(file), path: parsed.path, required: parsed.required });
  }
  return modules;
}
function parseGoMod(text) {
  let path;
  const required = [];
  let inRequireBlock = false;
  for (const rawLine of text.split("\n")) {
    const line = rawLine.replace(/\/\/.*$/, "").trim();
    if (inRequireBlock) {
      if (line === ")") inRequireBlock = false;
      else if (line) required.push(unquote(line.split(/\s+/)[0]));
      continue;
    }
    const moduleLine = /^module\s+(\S+)/.exec(line);
    if (moduleLine) path = unquote(moduleLine[1]);
    if (/^require\s*\($/.test(line)) inRequireBlock = true;
    const single = /^require\s+(\S+)/.exec(line);
    if (single && !single[1].startsWith("(")) required.push(unquote(single[1]));
  }
  return { path, required };
}

// src/languages/java.ts
var TYPE_KINDS2 = {
  class_declaration: "class",
  interface_declaration: "interface",
  annotation_type_declaration: "interface",
  enum_declaration: "enum",
  record_declaration: "record"
};
var METHOD_TYPES2 = /* @__PURE__ */ new Set(["method_declaration", "constructor_declaration"]);
var INTERFACE_BODIES = /* @__PURE__ */ new Set(["interface_body", "annotation_type_body"]);
var HERITAGE_CLAUSES = /* @__PURE__ */ new Set(["superclass", "super_interfaces", "extends_interfaces"]);
var SKIPPED_TYPES2 = /* @__PURE__ */ new Set([
  "field_declaration",
  "enum_constant",
  "static_initializer",
  "block",
  "lambda_expression",
  "object_creation_expression"
]);
function extractJava(root) {
  const packageName = packageOf(root);
  return {
    symbols: collectSymbols(root, classify3),
    imports: collectImports3(root),
    ...packageName ? { packageName } : {},
    ...hasMainMethod(root) ? { entryPoint: true } : {}
  };
}
function classify3(node) {
  const name2 = node.childForFieldName("name")?.text;
  const typeKind = TYPE_KINDS2[node.type];
  if (typeKind) return name2 ? { kind: typeKind, name: name2, exported: isExported2(node), extends: heritage2(node) } : void 0;
  if (METHOD_TYPES2.has(node.type)) return name2 ? { kind: "method", name: name2, exported: isExported2(node) } : void 0;
  return SKIPPED_TYPES2.has(node.type) ? "skip" : void 0;
}
function modifiersOf2(node) {
  const modifiers = node.namedChildren.find((child) => child.type === "modifiers");
  return new Set(modifiers?.children.map((child) => child.type));
}
function isExported2(node) {
  if (node.parent && INTERFACE_BODIES.has(node.parent.type)) return true;
  return modifiersOf2(node).has("public");
}
function heritage2(node) {
  return node.namedChildren.filter((child) => HERITAGE_CLAUSES.has(child.type)).flatMap((clause) => clause.namedChildren.flatMap((t) => t.type === "type_list" ? t.namedChildren : [t])).map((type) => type.text);
}
function packageOf(root) {
  const declaration = root.namedChildren.find((child) => child.type === "package_declaration");
  return declaration?.namedChildren[0]?.text;
}
function hasMainMethod(root) {
  let found = false;
  forEachNode(root, (node) => {
    if (node.type !== "method_declaration") return;
    if (node.childForFieldName("name")?.text === "main" && modifiersOf2(node).has("static")) found = true;
    return false;
  });
  return found;
}
function collectImports3(root) {
  return root.namedChildren.filter((child) => child.type === "import_declaration").flatMap((declaration) => {
    const path = declaration.namedChildren.find((c) => c.type === "scoped_identifier" || c.type === "identifier");
    if (!path) return [];
    const wildcard = declaration.namedChildren.some((c) => c.type === "asterisk");
    const lastSegment = path.text.slice(path.text.lastIndexOf(".") + 1);
    return [{ specifier: path.text, names: [wildcard ? "*" : lastSegment], line: lineOf(declaration) }];
  });
}
var java = {
  id: "java",
  displayName: "Java",
  grammar: "java",
  extensions: [".java"],
  ecosystem: "jvm",
  extract: extractJava
};

// src/languages/jvm-resolver.ts
var JVM_LANGUAGES = /* @__PURE__ */ new Set(["java", "kotlin"]);
var PLATFORM_PREFIXES = ["java.", "javax.", "jdk.", "sun.", "kotlin."];
var jvmResolver = (project) => {
  const index = buildIndex(project);
  return { resolve: (_fromPath, imported) => resolveImport2(index, imported.specifier, imported.names) };
};
function buildIndex(project) {
  const filesByName = /* @__PURE__ */ new Map();
  const dirs = /* @__PURE__ */ new Map();
  for (const entry of sortedJvmEntries(project)) {
    const { packageName } = entry;
    if (!packageName) continue;
    for (const symbol of entry.symbols) {
      if (!symbol.container && !filesByName.has(`${packageName}.${symbol.name}`)) {
        filesByName.set(`${packageName}.${symbol.name}`, entry.path);
      }
    }
    dirs.set(packageName, (dirs.get(packageName) ?? /* @__PURE__ */ new Set()).add(dirOf(entry.path)));
  }
  const dirsByPackage = new Map([...dirs].map(([name2, set]) => [name2, [...set].sort()]));
  return { filesByName, dirsByPackage };
}
function sortedJvmEntries(project) {
  return [...project.entries.values()].filter((entry) => entry.language !== void 0 && JVM_LANGUAGES.has(entry.language)).sort((a, b) => a.path.localeCompare(b.path));
}
function resolveImport2(index, specifier, names) {
  if (names[0] === "*") {
    const dir = index.dirsByPackage.get(specifier)?.[0];
    if (dir !== void 0) return { target: dir };
  }
  for (let name2 = specifier; name2.includes("."); name2 = name2.slice(0, name2.lastIndexOf("."))) {
    const file = index.filesByName.get(name2);
    if (file) return { target: file };
    if (index.dirsByPackage.has(name2)) return { unresolved: true };
  }
  return resolveOutsideProject(specifier);
}
function resolveOutsideProject(specifier) {
  const root = leadingSegments(specifier, 2);
  if (PLATFORM_PREFIXES.some((prefix) => specifier.startsWith(prefix))) return { builtin: root };
  return { external: root };
}
function leadingSegments(name2, count) {
  return name2.split(".").slice(0, count).join(".");
}

// src/languages/kotlin.ts
var HIDDEN_VISIBILITIES = /* @__PURE__ */ new Set(["private", "internal"]);
var SKIPPED_TYPES3 = /* @__PURE__ */ new Set([
  "lambda_literal",
  "anonymous_function",
  "object_literal",
  "secondary_constructor",
  "anonymous_initializer",
  "enum_entry"
]);
function extractKotlin(root) {
  const packageName = root.namedChildren.find((child) => child.type === "package_header")?.namedChildren[0]?.text;
  return {
    symbols: collectSymbols(root, classify4),
    imports: collectImports4(root),
    ...packageName ? { packageName } : {},
    ...hasTopLevelMain(root) ? { entryPoint: true } : {}
  };
}
function classify4(node) {
  const exported = !HIDDEN_VISIBILITIES.has(visibilityOf(node));
  switch (node.type) {
    case "class_declaration":
      return classifyClass(node, exported);
    case "object_declaration":
      return { kind: "object", name: typeNameOf(node) ?? "", exported, extends: heritage3(node) };
    case "companion_object":
      return { kind: "object", name: typeNameOf(node) ?? "Companion", exported };
    case "function_declaration":
      return { kind: "function", name: functionNameOf(node), exported };
    case "type_alias":
      return { kind: "type", name: typeNameOf(node) ?? "", exported };
    case "property_declaration":
      return classifyProperty(node, exported);
    default:
      return SKIPPED_TYPES3.has(node.type) ? "skip" : void 0;
  }
}
function classifyClass(node, exported) {
  const name2 = typeNameOf(node);
  if (!name2) return void 0;
  const keywords = new Set(node.children.map((child) => child.type));
  const kind = keywords.has("interface") ? "interface" : keywords.has("enum") ? "enum" : "class";
  return { kind, name: name2, exported, extends: heritage3(node) };
}
function classifyProperty(node, exported) {
  if (node.parent?.type !== "source_file") return "skip";
  const name2 = node.namedChildren.find((child) => child.type === "variable_declaration")?.namedChildren[0]?.text;
  return name2 ? { kind: "variable", name: name2, exported } : "skip";
}
function typeNameOf(node) {
  return node.namedChildren.find((child) => child.type === "type_identifier")?.text;
}
function functionNameOf(node) {
  return node.namedChildren.find((child) => child.type === "simple_identifier")?.text ?? "";
}
function visibilityOf(node) {
  const modifiers = node.namedChildren.find((child) => child.type === "modifiers");
  return modifiers?.namedChildren.find((child) => child.type === "visibility_modifier")?.text ?? "public";
}
function heritage3(node) {
  return node.namedChildren.filter((child) => child.type === "delegation_specifier").map((specifier) => specifier.namedChildren[0]).filter((supertype) => supertype !== void 0).map((supertype) => (supertype.type === "constructor_invocation" ? supertype.namedChildren[0] : supertype).text);
}
function hasTopLevelMain(root) {
  return root.namedChildren.some((child) => child.type === "function_declaration" && functionNameOf(child) === "main");
}
function collectImports4(root) {
  const list = root.namedChildren.find((child) => child.type === "import_list");
  return (list?.namedChildren ?? []).filter((child) => child.type === "import_header").flatMap((header2) => {
    const path = header2.namedChildren.find((child) => child.type === "identifier");
    if (!path) return [];
    const wildcard = header2.namedChildren.some((child) => child.type === "wildcard_import");
    const lastSegment = path.text.slice(path.text.lastIndexOf(".") + 1);
    return [{ specifier: path.text, names: [wildcard ? "*" : lastSegment], line: lineOf(header2) }];
  });
}
var kotlin = {
  id: "kotlin",
  displayName: "Kotlin",
  grammar: "kotlin",
  extensions: [".kt", ".kts"],
  ecosystem: "jvm",
  extract: extractKotlin
};

// src/languages/node-resolver.ts
import { builtinModules } from "node:module";

// src/jsonc.ts
function parseJsonc(text) {
  try {
    return JSON.parse(stripTrailingCommas(stripComments(text)));
  } catch {
    return void 0;
  }
}
function stripComments(text) {
  let result = "";
  let i2 = 0;
  while (i2 < text.length) {
    const char = text[i2];
    if (char === '"') {
      const end = endOfString(text, i2);
      result += text.slice(i2, end);
      i2 = end;
    } else if (char === "/" && text[i2 + 1] === "/") {
      while (i2 < text.length && text[i2] !== "\n") i2++;
    } else if (char === "/" && text[i2 + 1] === "*") {
      const close = text.indexOf("*/", i2 + 2);
      i2 = close === -1 ? text.length : close + 2;
    } else {
      result += char;
      i2++;
    }
  }
  return result;
}
function endOfString(text, start2) {
  let i2 = start2 + 1;
  while (i2 < text.length && text[i2] !== '"') i2 += text[i2] === "\\" ? 2 : 1;
  return i2 + 1;
}
function stripTrailingCommas(text) {
  let result = "";
  let i2 = 0;
  while (i2 < text.length) {
    if (text[i2] === '"') {
      const end = endOfString(text, i2);
      result += text.slice(i2, end);
      i2 = end;
      continue;
    }
    if (text[i2] === ",") {
      let next = i2 + 1;
      while (/\s/.test(text[next] ?? "")) next++;
      if (text[next] === "}" || text[next] === "]") {
        i2++;
        continue;
      }
    }
    result += text[i2];
    i2++;
  }
  return result;
}

// src/languages/node-resolver.ts
var SOURCE_EXTENSIONS = [".ts", ".tsx", ".d.ts", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs", ".json", ".vue", ".svelte"];
var COMPILED_TO_SOURCE = {
  ".js": [".ts", ".tsx"],
  ".jsx": [".tsx"],
  ".mjs": [".mts"],
  ".cjs": [".cts"]
};
var BUILTINS = new Set(builtinModules);
var PACKAGE_NAME = /^(@[\w.~-]+\/)?[\w.~-]+$/;
var nodeResolver = (project) => {
  const findFile = fileFinder(project.files);
  const configs = new CompilerPathsCache(project);
  const packages = workspacePackages(project);
  const resolveBare = (fromPath, specifier) => {
    const compilerPaths = configs.forFile(fromPath);
    for (const candidate of aliasCandidates(compilerPaths, specifier)) {
      const target = findFile(candidate);
      if (target) return { target };
    }
    const packageName = packageNameOf2(specifier);
    const local = packageName ? packages.get(packageName) : void 0;
    if (local) {
      const target = resolveWorkspaceImport(local, specifier.slice(packageName.length + 1), findFile);
      if (target) return { target };
    }
    if (compilerPaths.baseUrl !== void 0) {
      const target = findFile(joinRepoPath(compilerPaths.baseUrl, specifier));
      if (target) return { target };
    }
    if (specifier.startsWith("node:") || BUILTINS.has(specifier) || BUILTINS.has(packageName ?? "")) {
      return { builtin: specifier.replace(/^node:/, "") };
    }
    return packageName ? { external: packageName } : { unresolved: true };
  };
  return {
    resolve(fromPath, imported) {
      const specifier = imported.specifier.split("?")[0];
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        const base = specifier.startsWith("/") ? "" : dirOf(fromPath);
        const target = findFile(joinRepoPath(base, specifier.replace(/^\//, "")));
        return target ? { target } : { unresolved: true };
      }
      return resolveBare(fromPath, specifier);
    }
  };
};
function fileFinder(files) {
  return (candidate) => {
    if (candidate === void 0) return void 0;
    if (files.has(candidate)) return candidate;
    for (const [compiled, sources] of Object.entries(COMPILED_TO_SOURCE)) {
      if (!candidate.endsWith(compiled)) continue;
      const stem = candidate.slice(0, -compiled.length);
      const found = sources.map((ext) => stem + ext).find((path) => files.has(path));
      if (found) return found;
    }
    for (const ext of SOURCE_EXTENSIONS) if (files.has(candidate + ext)) return candidate + ext;
    const indexBase = candidate === "" ? "index" : `${candidate}/index`;
    for (const ext of SOURCE_EXTENSIONS) if (files.has(indexBase + ext)) return indexBase + ext;
    return void 0;
  };
}
function packageNameOf2(specifier) {
  const parts2 = specifier.split("/");
  const name2 = specifier.startsWith("@") ? parts2.slice(0, 2).join("/") : parts2[0];
  return PACKAGE_NAME.test(name2) && !name2.startsWith(".") ? name2 : void 0;
}
function aliasCandidates(paths, specifier) {
  const candidates = [];
  for (const alias of paths.aliases) {
    if (alias.hasWildcard) {
      if (!specifier.startsWith(alias.prefix) || !specifier.endsWith(alias.suffix)) continue;
      const matched = specifier.slice(alias.prefix.length, specifier.length - alias.suffix.length);
      candidates.push(...alias.targets.map((target) => target.replace("*", matched)));
    } else if (specifier === alias.prefix) {
      candidates.push(...alias.targets);
    }
  }
  return candidates;
}
function resolveWorkspaceImport(pkg, subpath, findFile) {
  if (subpath) return findFile(joinRepoPath(pkg.dir, subpath)) ?? findFile(joinRepoPath(pkg.dir, "src", subpath));
  const candidates = [...pkg.entries, joinRepoPath(pkg.dir, "src/index"), joinRepoPath(pkg.dir, "index")];
  for (const candidate of candidates) {
    const found = findFile(candidate) ?? findFile(builtToSource(candidate, pkg.dir));
    if (found) return found;
  }
  return void 0;
}
function builtToSource(entry, dir) {
  if (!entry) return void 0;
  const inside = dir === "" ? entry : entry.slice(dir.length + 1);
  const swapped = inside.replace(/^(dist|lib|build|out)\//, "src/").replace(/\.(c|m)?js$/, "");
  return joinRepoPath(dir, swapped);
}
function workspacePackages(project) {
  const packages = /* @__PURE__ */ new Map();
  for (const path of project.files) {
    if (baseName(path) !== "package.json") continue;
    const manifest = parseJsonc(project.readText(path) ?? "");
    const name2 = typeof manifest?.name === "string" ? manifest.name : void 0;
    if (!name2 || packages.has(name2)) continue;
    const dir = dirOf(path);
    const entries = [manifest.source, manifest.module, manifest.main, exportEntry(manifest.exports)].filter((value) => typeof value === "string").map((entry) => joinRepoPath(dir, entry)).filter((entry) => entry !== void 0);
    packages.set(name2, { dir, entries });
  }
  return packages;
}
function exportEntry(exports2) {
  if (typeof exports2 === "string") return exports2;
  if (!exports2 || typeof exports2 !== "object") return void 0;
  const root = exports2["."] ?? exports2;
  if (typeof root === "string") return root;
  if (!root || typeof root !== "object") return void 0;
  const conditions = root;
  for (const key of ["source", "import", "default", "require", "types"]) {
    const value = conditions[key];
    if (typeof value === "string") return value;
  }
  return void 0;
}
var CompilerPathsCache = class {
  byDir = /* @__PURE__ */ new Map();
  project;
  constructor(project) {
    this.project = project;
  }
  forFile(path) {
    const configDir = ancestorDirs(path).find((dir) => this.configPathIn(dir) !== void 0);
    if (configDir === void 0) return { aliases: [] };
    let paths = this.byDir.get(configDir);
    if (!paths) {
      paths = this.load(this.configPathIn(configDir), /* @__PURE__ */ new Set());
      this.byDir.set(configDir, paths);
    }
    return paths;
  }
  configPathIn(dir) {
    return ["tsconfig.json", "jsconfig.json"].map((name2) => dir === "" ? name2 : `${dir}/${name2}`).find((path) => this.project.files.has(path));
  }
  load(configPath, seen) {
    seen.add(configPath);
    const config = parseJsonc(this.project.readText(configPath) ?? "");
    const configDir = dirOf(configPath);
    let inherited = { aliases: [] };
    for (const parent of [config?.extends ?? []].flat()) {
      if (!parent.startsWith(".")) continue;
      const parentPath = joinRepoPath(configDir, parent.endsWith(".json") ? parent : `${parent}.json`);
      if (parentPath && this.project.files.has(parentPath) && !seen.has(parentPath)) inherited = this.load(parentPath, seen);
    }
    const options = config?.compilerOptions ?? {};
    const baseUrl = options.baseUrl !== void 0 ? joinRepoPath(configDir, options.baseUrl) : inherited.baseUrl;
    if (!options.paths) return { baseUrl, aliases: inherited.aliases };
    const pathsBase = options.baseUrl !== void 0 ? baseUrl : configDir;
    const aliases = Object.entries(options.paths).map(([pattern, targets]) => toAlias(pattern, targets, pathsBase ?? ""));
    return { baseUrl, aliases };
  }
};
function toAlias(pattern, targets, base) {
  const star = pattern.indexOf("*");
  return {
    prefix: star === -1 ? pattern : pattern.slice(0, star),
    suffix: star === -1 ? "" : pattern.slice(star + 1),
    hasWildcard: star !== -1,
    targets: targets.map((target) => joinRepoPath(base, target)).filter((t) => t !== void 0)
  };
}

// src/languages/python.ts
function extractPython(root, source) {
  return {
    symbols: collectSymbols(root, classify5),
    imports: collectImports5(root),
    .../^if\s+__name__\s*==\s*['"]__main__['"]\s*:/m.test(source) ? { entryPoint: true } : {}
  };
}
var isPublic2 = (name2) => !name2.startsWith("_") || /^__\w+__$/.test(name2);
function classify5(node) {
  const name2 = node.childForFieldName("name")?.text;
  switch (node.type) {
    case "class_definition":
      return name2 ? { kind: "class", name: name2, exported: isPublic2(name2), extends: superclasses(node), span: decoratedSpan(node) } : void 0;
    case "function_definition":
      return name2 ? { kind: "function", name: name2, exported: isPublic2(name2), span: decoratedSpan(node) } : void 0;
    case "assignment":
      return classifyModuleVariable(node);
    case "lambda":
      return "skip";
    default:
      return void 0;
  }
}
function decoratedSpan(node) {
  return node.parent?.type === "decorated_definition" ? node.parent : node;
}
function superclasses(node) {
  const list = node.childForFieldName("superclasses");
  if (!list) return [];
  return list.namedChildren.filter((arg) => arg.type !== "keyword_argument").map((arg) => arg.text);
}
function classifyModuleVariable(node) {
  const target = node.childForFieldName("left");
  const isModuleLevel = node.parent?.type === "expression_statement" && node.parent.parent?.type === "module";
  if (!isModuleLevel || target?.type !== "identifier" || /^__\w+__$/.test(target.text)) return "skip";
  return { kind: "variable", name: target.text, exported: isPublic2(target.text) };
}
function collectImports5(root) {
  const imports = [];
  forEachNode(root, (node) => {
    if (node.type === "import_statement") {
      for (const name2 of node.childrenForFieldName("name")) {
        const module2 = name2.type === "aliased_import" ? name2.childForFieldName("name") : name2;
        if (module2) imports.push({ specifier: module2.text, names: [], line: lineOf(node) });
      }
      return false;
    }
    if (node.type === "import_from_statement") {
      const module2 = node.childForFieldName("module_name");
      if (module2) imports.push({ specifier: module2.text.replace(/\s+/g, ""), names: fromNames(node), line: lineOf(node) });
      return false;
    }
    return true;
  });
  return imports;
}
function fromNames(node) {
  if (node.namedChildren.some((child) => child.type === "wildcard_import")) return ["*"];
  return node.childrenForFieldName("name").map(
    (name2) => name2.type === "aliased_import" ? name2.childForFieldName("name")?.text ?? name2.text : name2.text
  );
}
var python = {
  id: "python",
  displayName: "Python",
  grammar: "python",
  extensions: [".py", ".pyi"],
  ecosystem: "python",
  extract: extractPython
};
var pythonResolver = (project) => {
  const modules = /* @__PURE__ */ new Map();
  const addModule = (name2, path) => {
    if (name2 && !modules.has(name2)) modules.set(name2, path);
  };
  for (const path of project.files) {
    if (!/\.pyi?$/.test(path)) continue;
    const dotted = path.replace(/\.pyi?$/, "").replace(/\/__init__$/, "").replace(/^__init__$/, "");
    for (const root of sourceRootsOf(path, project.files)) {
      const relative3 = root === "" ? dotted : dotted.startsWith(`${root}/`) ? dotted.slice(root.length + 1) : void 0;
      if (relative3 !== void 0) addModule(relative3.replaceAll("/", "."), path);
    }
  }
  const lookup = (dotted) => {
    const parts2 = dotted.split(".");
    for (let length = parts2.length; length > 0; length--) {
      const found = modules.get(parts2.slice(0, length).join("."));
      if (found) return found;
    }
    return void 0;
  };
  return {
    resolve(fromPath, imported) {
      if (imported.specifier.startsWith(".")) return resolveRelative(fromPath, imported, project.files);
      const candidates = imported.names.filter((n) => n !== "*").map((n) => `${imported.specifier}.${n}`);
      const target = candidates.map((c) => modules.get(c)).find(Boolean) ?? lookup(imported.specifier);
      if (target) return { target };
      const top = imported.specifier.split(".")[0];
      return PYTHON_STDLIB.has(top) ? { builtin: top } : { external: top };
    }
  };
};
function sourceRootsOf(path, files) {
  const roots = /* @__PURE__ */ new Set([""]);
  if (path.startsWith("src/")) roots.add("src");
  const packageRoot = ancestorDirs(path).find((dir) => dir === "" || !files.has(`${dir}/__init__.py`));
  if (packageRoot !== void 0) roots.add(packageRoot);
  return [...roots];
}
function resolveRelative(fromPath, imported, files) {
  const dots = imported.specifier.match(/^\.+/)[0].length;
  const modulePath = imported.specifier.slice(dots).replaceAll(".", "/");
  let base = dirOf(fromPath);
  for (let level = 1; level < dots && base !== void 0; level++) base = base === "" ? void 0 : dirOf(base);
  if (base === void 0) return { unresolved: true };
  const moduleDir = joinRepoPath(base, modulePath);
  if (moduleDir === void 0) return { unresolved: true };
  const asFile = (dir, name2) => {
    const stem = name2 ? joinRepoPath(dir, name2) : dir;
    const options = [`${stem}.py`, `${stem}.pyi`, `${stem}/__init__.py`];
    return options.find((option) => files.has(option));
  };
  const named = imported.names.filter((n) => n !== "*").map((n) => asFile(moduleDir, n)).find(Boolean);
  const target = named ?? (modulePath ? asFile(moduleDir) : asFile(base, "__init__"));
  return target ? { target } : { unresolved: true };
}
var PYTHON_STDLIB = new Set(
  `__future__ _thread abc aifc argparse array ast asyncio atexit base64 bdb binascii bisect builtins bz2
  calendar cmath cmd code codecs codeop collections colorsys compileall concurrent configparser contextlib
  contextvars copy copyreg cProfile csv ctypes curses dataclasses datetime dbm decimal difflib dis doctest
  email encodings ensurepip enum errno faulthandler fcntl filecmp fileinput fnmatch fractions ftplib functools
  gc getopt getpass gettext glob graphlib grp gzip hashlib heapq hmac html http idlelib imaplib importlib
  inspect io ipaddress itertools json keyword linecache locale logging lzma mailbox marshal math mimetypes
  mmap modulefinder msvcrt multiprocessing netrc numbers operator optparse os pathlib pdb pickle pickletools
  pkgutil platform plistlib poplib posix pprint profile pstats pty pwd py_compile pyclbr pydoc queue quopri
  random re readline reprlib resource rlcompleter runpy sched secrets select selectors shelve shlex shutil
  signal site smtplib socket socketserver sqlite3 ssl stat statistics string stringprep struct subprocess
  symtable sys sysconfig syslog tabnanny tarfile tempfile termios textwrap threading time timeit tkinter
  token tokenize tomllib trace traceback tracemalloc tty turtle types typing unicodedata unittest urllib
  uuid venv warnings wave weakref webbrowser winreg winsound wsgiref xml xmlrpc zipapp zipfile zipimport zlib
  zoneinfo`.split(/\s+/)
);

// node_modules/smol-toml/dist/error.js
function getLineColFromPtr(string, ptr) {
  let lines = string.slice(0, ptr).split(/\r\n|\n|\r/g);
  return [lines.length, lines.pop().length + 1];
}
function makeCodeBlock(string, line, column) {
  let lines = string.split(/\r\n|\n|\r/g);
  let codeblock = "";
  let numberLen = (Math.log10(line + 1) | 0) + 1;
  for (let i2 = line - 1; i2 <= line + 1; i2++) {
    let l = lines[i2 - 1];
    if (!l)
      continue;
    codeblock += i2.toString().padEnd(numberLen, " ");
    codeblock += ":  ";
    codeblock += l;
    codeblock += "\n";
    if (i2 === line) {
      codeblock += " ".repeat(numberLen + column + 2);
      codeblock += "^\n";
    }
  }
  return codeblock;
}
var TomlError = class extends Error {
  line;
  column;
  codeblock;
  constructor(message, options) {
    const [line, column] = getLineColFromPtr(options.toml, options.ptr);
    const codeblock = makeCodeBlock(options.toml, line, column);
    super(`Invalid TOML document: ${message}

${codeblock}`, options);
    this.line = line;
    this.column = column;
    this.codeblock = codeblock;
  }
};

// node_modules/smol-toml/dist/util.js
function indexOfNewline(str, start2 = 0, end = str.length) {
  let idx = str.indexOf("\n", start2);
  if (str[idx - 1] === "\r")
    idx--;
  return idx <= end ? idx : -1;
}
function skipComment(str, ptr) {
  for (let i2 = ptr; i2 < str.length; i2++) {
    let c = str[i2];
    if (c === "\n")
      return i2;
    if (c === "\r" && str[i2 + 1] === "\n")
      return i2 + 1;
    if (c < " " && c !== "	" || c === "\x7F") {
      throw new TomlError("control characters are not allowed in comments", {
        toml: str,
        ptr
      });
    }
  }
  return str.length;
}
function skipVoid(str, ptr, banNewLines, banComments) {
  let c;
  while ((c = str[ptr]) === " " || c === "	" || !banNewLines && (c === "\n" || c === "\r" && str[ptr + 1] === "\n"))
    ptr++;
  return banComments || c !== "#" ? ptr : skipVoid(str, skipComment(str, ptr), banNewLines);
}
function skipUntil(str, ptr, sep, end, banNewLines = false) {
  if (!end) {
    ptr = indexOfNewline(str, ptr);
    return ptr < 0 ? str.length : ptr;
  }
  for (let i2 = ptr; i2 < str.length; i2++) {
    let c = str[i2];
    if (c === "#") {
      i2 = indexOfNewline(str, i2);
    } else if (c === sep) {
      return i2 + 1;
    } else if (c === end || banNewLines && (c === "\n" || c === "\r" && str[i2 + 1] === "\n")) {
      return i2;
    }
  }
  throw new TomlError("cannot find end of structure", {
    toml: str,
    ptr
  });
}
function getStringEnd(str, seek) {
  let first = str[seek];
  let target = first === str[seek + 1] && str[seek + 1] === str[seek + 2] ? str.slice(seek, seek + 3) : first;
  seek += target.length - 1;
  do
    seek = str.indexOf(target, ++seek);
  while (seek > -1 && first !== "'" && str[seek - 1] === "\\" && (str[seek - 2] !== "\\" || str[seek - 3] === "\\"));
  if (seek > -1) {
    seek += target.length;
    if (target.length > 1) {
      if (str[seek] === first)
        seek++;
      if (str[seek] === first)
        seek++;
    }
  }
  return seek;
}

// node_modules/smol-toml/dist/date.js
var DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}:\d{2}(?:\.\d+)?)?(Z|[-+]\d{2}:\d{2})?$/i;
var TomlDate = class _TomlDate extends Date {
  #hasDate = false;
  #hasTime = false;
  #offset = null;
  constructor(date) {
    let hasDate = true;
    let hasTime = true;
    let offset = "Z";
    if (typeof date === "string") {
      let match = date.match(DATE_TIME_RE);
      if (match) {
        if (!match[1]) {
          hasDate = false;
          date = `0000-01-01T${date}`;
        }
        hasTime = !!match[2];
        hasTime && date[10] === " " && (date = date.replace(" ", "T"));
        if (match[2] && +match[2] > 23) {
          date = "";
        } else {
          offset = match[3] || null;
          date = date.toUpperCase();
          if (!offset && hasTime)
            date += "Z";
        }
      } else {
        date = "";
      }
    }
    super(date);
    if (!isNaN(this.getTime())) {
      this.#hasDate = hasDate;
      this.#hasTime = hasTime;
      this.#offset = offset;
    }
  }
  isDateTime() {
    return this.#hasDate && this.#hasTime;
  }
  isLocal() {
    return !this.#hasDate || !this.#hasTime || !this.#offset;
  }
  isDate() {
    return this.#hasDate && !this.#hasTime;
  }
  isTime() {
    return this.#hasTime && !this.#hasDate;
  }
  isValid() {
    return this.#hasDate || this.#hasTime;
  }
  toISOString() {
    let iso = super.toISOString();
    if (this.isDate())
      return iso.slice(0, 10);
    if (this.isTime())
      return iso.slice(11, 23);
    if (this.#offset === null)
      return iso.slice(0, -1);
    if (this.#offset === "Z")
      return iso;
    let offset = +this.#offset.slice(1, 3) * 60 + +this.#offset.slice(4, 6);
    offset = this.#offset[0] === "-" ? offset : -offset;
    let offsetDate = new Date(this.getTime() - offset * 6e4);
    return offsetDate.toISOString().slice(0, -1) + this.#offset;
  }
  static wrapAsOffsetDateTime(jsDate, offset = "Z") {
    let date = new _TomlDate(jsDate);
    date.#offset = offset;
    return date;
  }
  static wrapAsLocalDateTime(jsDate) {
    let date = new _TomlDate(jsDate);
    date.#offset = null;
    return date;
  }
  static wrapAsLocalDate(jsDate) {
    let date = new _TomlDate(jsDate);
    date.#hasTime = false;
    date.#offset = null;
    return date;
  }
  static wrapAsLocalTime(jsDate) {
    let date = new _TomlDate(jsDate);
    date.#hasDate = false;
    date.#offset = null;
    return date;
  }
};

// node_modules/smol-toml/dist/primitive.js
var INT_REGEX = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/;
var FLOAT_REGEX = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/;
var LEADING_ZERO = /^[+-]?0[0-9_]/;
var ESCAPE_REGEX = /^[0-9a-f]{4,8}$/i;
var ESC_MAP = {
  b: "\b",
  t: "	",
  n: "\n",
  f: "\f",
  r: "\r",
  '"': '"',
  "\\": "\\"
};
function parseString(str, ptr = 0, endPtr = str.length) {
  let isLiteral = str[ptr] === "'";
  let isMultiline = str[ptr++] === str[ptr] && str[ptr] === str[ptr + 1];
  if (isMultiline) {
    endPtr -= 2;
    if (str[ptr += 2] === "\r")
      ptr++;
    if (str[ptr] === "\n")
      ptr++;
  }
  let tmp = 0;
  let isEscape;
  let parsed = "";
  let sliceStart = ptr;
  while (ptr < endPtr - 1) {
    let c = str[ptr++];
    if (c === "\n" || c === "\r" && str[ptr] === "\n") {
      if (!isMultiline) {
        throw new TomlError("newlines are not allowed in strings", {
          toml: str,
          ptr: ptr - 1
        });
      }
    } else if (c < " " && c !== "	" || c === "\x7F") {
      throw new TomlError("control characters are not allowed in strings", {
        toml: str,
        ptr: ptr - 1
      });
    }
    if (isEscape) {
      isEscape = false;
      if (c === "u" || c === "U") {
        let code2 = str.slice(ptr, ptr += c === "u" ? 4 : 8);
        if (!ESCAPE_REGEX.test(code2)) {
          throw new TomlError("invalid unicode escape", {
            toml: str,
            ptr: tmp
          });
        }
        try {
          parsed += String.fromCodePoint(parseInt(code2, 16));
        } catch {
          throw new TomlError("invalid unicode escape", {
            toml: str,
            ptr: tmp
          });
        }
      } else if (isMultiline && (c === "\n" || c === " " || c === "	" || c === "\r")) {
        ptr = skipVoid(str, ptr - 1, true);
        if (str[ptr] !== "\n" && str[ptr] !== "\r") {
          throw new TomlError("invalid escape: only line-ending whitespace may be escaped", {
            toml: str,
            ptr: tmp
          });
        }
        ptr = skipVoid(str, ptr);
      } else if (c in ESC_MAP) {
        parsed += ESC_MAP[c];
      } else {
        throw new TomlError("unrecognized escape sequence", {
          toml: str,
          ptr: tmp
        });
      }
      sliceStart = ptr;
    } else if (!isLiteral && c === "\\") {
      tmp = ptr - 1;
      isEscape = true;
      parsed += str.slice(sliceStart, tmp);
    }
  }
  return parsed + str.slice(sliceStart, endPtr - 1);
}
function parseValue(value, toml, ptr) {
  if (value === "true")
    return true;
  if (value === "false")
    return false;
  if (value === "-inf")
    return -Infinity;
  if (value === "inf" || value === "+inf")
    return Infinity;
  if (value === "nan" || value === "+nan" || value === "-nan")
    return NaN;
  if (value === "-0")
    return 0;
  let isInt;
  if ((isInt = INT_REGEX.test(value)) || FLOAT_REGEX.test(value)) {
    if (LEADING_ZERO.test(value)) {
      throw new TomlError("leading zeroes are not allowed", {
        toml,
        ptr
      });
    }
    let numeric = +value.replace(/_/g, "");
    if (isNaN(numeric)) {
      throw new TomlError("invalid number", {
        toml,
        ptr
      });
    }
    if (isInt && !Number.isSafeInteger(numeric)) {
      throw new TomlError("integer value cannot be represented losslessly", {
        toml,
        ptr
      });
    }
    return numeric;
  }
  let date = new TomlDate(value);
  if (!date.isValid()) {
    throw new TomlError("invalid value", {
      toml,
      ptr
    });
  }
  return date;
}

// node_modules/smol-toml/dist/extract.js
function sliceAndTrimEndOf(str, startPtr, endPtr, allowNewLines) {
  let value = str.slice(startPtr, endPtr);
  let commentIdx = value.indexOf("#");
  if (commentIdx > -1) {
    skipComment(str, commentIdx);
    value = value.slice(0, commentIdx);
  }
  let trimmed = value.trimEnd();
  if (!allowNewLines) {
    let newlineIdx = value.indexOf("\n", trimmed.length);
    if (newlineIdx > -1) {
      throw new TomlError("newlines are not allowed in inline tables", {
        toml: str,
        ptr: startPtr + newlineIdx
      });
    }
  }
  return [trimmed, commentIdx];
}
function extractValue(str, ptr, end, depth = -1) {
  if (depth === 0) {
    throw new TomlError("document contains excessively nested structures. aborting.", {
      toml: str,
      ptr
    });
  }
  let c = str[ptr];
  if (c === "[" || c === "{") {
    let [value, endPtr2] = c === "[" ? parseArray(str, ptr, depth) : parseInlineTable(str, ptr, depth);
    let newPtr = end ? skipUntil(str, endPtr2, ",", end) : endPtr2;
    if (endPtr2 - newPtr && end === "}") {
      let nextNewLine = indexOfNewline(str, endPtr2, newPtr);
      if (nextNewLine > -1) {
        throw new TomlError("newlines are not allowed in inline tables", {
          toml: str,
          ptr: nextNewLine
        });
      }
    }
    return [value, newPtr];
  }
  let endPtr;
  if (c === '"' || c === "'") {
    endPtr = getStringEnd(str, ptr);
    let parsed = parseString(str, ptr, endPtr);
    if (end) {
      endPtr = skipVoid(str, endPtr, end !== "]");
      if (str[endPtr] && str[endPtr] !== "," && str[endPtr] !== end && str[endPtr] !== "\n" && str[endPtr] !== "\r") {
        throw new TomlError("unexpected character encountered", {
          toml: str,
          ptr: endPtr
        });
      }
      endPtr += +(str[endPtr] === ",");
    }
    return [parsed, endPtr];
  }
  endPtr = skipUntil(str, ptr, ",", end);
  let slice = sliceAndTrimEndOf(str, ptr, endPtr - +(str[endPtr - 1] === ","), end === "]");
  if (!slice[0]) {
    throw new TomlError("incomplete key-value declaration: no value specified", {
      toml: str,
      ptr
    });
  }
  if (end && slice[1] > -1) {
    endPtr = skipVoid(str, ptr + slice[1]);
    endPtr += +(str[endPtr] === ",");
  }
  return [
    parseValue(slice[0], str, ptr),
    endPtr
  ];
}

// node_modules/smol-toml/dist/struct.js
var KEY_PART_RE = /^[a-zA-Z0-9-_]+[ \t]*$/;
function parseKey(str, ptr, end = "=") {
  let dot = ptr - 1;
  let parsed = [];
  let endPtr = str.indexOf(end, ptr);
  if (endPtr < 0) {
    throw new TomlError("incomplete key-value: cannot find end of key", {
      toml: str,
      ptr
    });
  }
  do {
    let c = str[ptr = ++dot];
    if (c !== " " && c !== "	") {
      if (c === '"' || c === "'") {
        if (c === str[ptr + 1] && c === str[ptr + 2]) {
          throw new TomlError("multiline strings are not allowed in keys", {
            toml: str,
            ptr
          });
        }
        let eos = getStringEnd(str, ptr);
        if (eos < 0) {
          throw new TomlError("unfinished string encountered", {
            toml: str,
            ptr
          });
        }
        dot = str.indexOf(".", eos);
        let strEnd = str.slice(eos, dot < 0 || dot > endPtr ? endPtr : dot);
        let newLine = indexOfNewline(strEnd);
        if (newLine > -1) {
          throw new TomlError("newlines are not allowed in keys", {
            toml: str,
            ptr: ptr + dot + newLine
          });
        }
        if (strEnd.trimStart()) {
          throw new TomlError("found extra tokens after the string part", {
            toml: str,
            ptr: eos
          });
        }
        if (endPtr < eos) {
          endPtr = str.indexOf(end, eos);
          if (endPtr < 0) {
            throw new TomlError("incomplete key-value: cannot find end of key", {
              toml: str,
              ptr
            });
          }
        }
        parsed.push(parseString(str, ptr, eos));
      } else {
        dot = str.indexOf(".", ptr);
        let part = str.slice(ptr, dot < 0 || dot > endPtr ? endPtr : dot);
        if (!KEY_PART_RE.test(part)) {
          throw new TomlError("only letter, numbers, dashes and underscores are allowed in keys", {
            toml: str,
            ptr
          });
        }
        parsed.push(part.trimEnd());
      }
    }
  } while (dot + 1 && dot < endPtr);
  return [parsed, skipVoid(str, endPtr + 1, true, true)];
}
function parseInlineTable(str, ptr, depth = -1) {
  let res = {};
  let seen = /* @__PURE__ */ new Set();
  let c;
  let comma = 0;
  ptr++;
  while ((c = str[ptr++]) !== "}" && c) {
    if (c === "\n") {
      throw new TomlError("newlines are not allowed in inline tables", {
        toml: str,
        ptr: ptr - 1
      });
    } else if (c === "#") {
      throw new TomlError("inline tables cannot contain comments", {
        toml: str,
        ptr: ptr - 1
      });
    } else if (c === ",") {
      throw new TomlError("expected key-value, found comma", {
        toml: str,
        ptr: ptr - 1
      });
    } else if (c !== " " && c !== "	") {
      let k;
      let t = res;
      let hasOwn = false;
      let [key, keyEndPtr] = parseKey(str, ptr - 1);
      for (let i2 = 0; i2 < key.length; i2++) {
        if (i2)
          t = hasOwn ? t[k] : t[k] = {};
        k = key[i2];
        if ((hasOwn = Object.hasOwn(t, k)) && (typeof t[k] !== "object" || seen.has(t[k]))) {
          throw new TomlError("trying to redefine an already defined value", {
            toml: str,
            ptr
          });
        }
        if (!hasOwn && k === "__proto__") {
          Object.defineProperty(t, k, { enumerable: true, configurable: true, writable: true });
        }
      }
      if (hasOwn) {
        throw new TomlError("trying to redefine an already defined value", {
          toml: str,
          ptr
        });
      }
      let [value, valueEndPtr] = extractValue(str, keyEndPtr, "}", depth - 1);
      seen.add(value);
      t[k] = value;
      ptr = valueEndPtr;
      comma = str[ptr - 1] === "," ? ptr - 1 : 0;
    }
  }
  if (comma) {
    throw new TomlError("trailing commas are not allowed in inline tables", {
      toml: str,
      ptr: comma
    });
  }
  if (!c) {
    throw new TomlError("unfinished table encountered", {
      toml: str,
      ptr
    });
  }
  return [res, ptr];
}
function parseArray(str, ptr, depth = -1) {
  let res = [];
  let c;
  ptr++;
  while ((c = str[ptr++]) !== "]" && c) {
    if (c === ",") {
      throw new TomlError("expected value, found comma", {
        toml: str,
        ptr: ptr - 1
      });
    } else if (c === "#")
      ptr = skipComment(str, ptr);
    else if (c !== " " && c !== "	" && c !== "\n" && c !== "\r") {
      let e = extractValue(str, ptr - 1, "]", depth - 1);
      res.push(e[0]);
      ptr = e[1];
    }
  }
  if (!c) {
    throw new TomlError("unfinished array encountered", {
      toml: str,
      ptr
    });
  }
  return [res, ptr];
}

// node_modules/smol-toml/dist/parse.js
function peekTable(key, table, meta, type) {
  let t = table;
  let m = meta;
  let k;
  let hasOwn = false;
  let state;
  for (let i2 = 0; i2 < key.length; i2++) {
    if (i2) {
      t = hasOwn ? t[k] : t[k] = {};
      m = (state = m[k]).c;
      if (type === 0 && (state.t === 1 || state.t === 2)) {
        return null;
      }
      if (state.t === 2) {
        let l = t.length - 1;
        t = t[l];
        m = m[l].c;
      }
    }
    k = key[i2];
    if ((hasOwn = Object.hasOwn(t, k)) && m[k]?.t === 0 && m[k]?.d) {
      return null;
    }
    if (!hasOwn) {
      if (k === "__proto__") {
        Object.defineProperty(t, k, { enumerable: true, configurable: true, writable: true });
        Object.defineProperty(m, k, { enumerable: true, configurable: true, writable: true });
      }
      m[k] = {
        t: i2 < key.length - 1 && type === 2 ? 3 : type,
        d: false,
        i: 0,
        c: {}
      };
    }
  }
  state = m[k];
  if (state.t !== type && !(type === 1 && state.t === 3)) {
    return null;
  }
  if (type === 2) {
    if (!state.d) {
      state.d = true;
      t[k] = [];
    }
    t[k].push(t = {});
    state.c[state.i++] = state = { t: 1, d: false, i: 0, c: {} };
  }
  if (state.d) {
    return null;
  }
  state.d = true;
  if (type === 1) {
    t = hasOwn ? t[k] : t[k] = {};
  } else if (type === 0 && hasOwn) {
    return null;
  }
  return [k, t, state.c];
}
function parse(toml, opts) {
  let maxDepth = opts?.maxDepth ?? 1e3;
  let res = {};
  let meta = {};
  let tbl = res;
  let m = meta;
  for (let ptr = skipVoid(toml, 0); ptr < toml.length; ) {
    if (toml[ptr] === "[") {
      let isTableArray = toml[++ptr] === "[";
      let k = parseKey(toml, ptr += +isTableArray, "]");
      if (isTableArray) {
        if (toml[k[1] - 1] !== "]") {
          throw new TomlError("expected end of table declaration", {
            toml,
            ptr: k[1] - 1
          });
        }
        k[1]++;
      }
      let p = peekTable(
        k[0],
        res,
        meta,
        isTableArray ? 2 : 1
        /* Type.EXPLICIT */
      );
      if (!p) {
        throw new TomlError("trying to redefine an already defined table or value", {
          toml,
          ptr
        });
      }
      m = p[2];
      tbl = p[1];
      ptr = k[1];
    } else {
      let k = parseKey(toml, ptr);
      let p = peekTable(
        k[0],
        tbl,
        m,
        0
        /* Type.DOTTED */
      );
      if (!p) {
        throw new TomlError("trying to redefine an already defined table or value", {
          toml,
          ptr
        });
      }
      let v = extractValue(toml, k[1], void 0, maxDepth);
      p[1][p[0]] = v[0];
      ptr = v[1];
    }
    ptr = skipVoid(toml, ptr, true);
    if (toml[ptr] && toml[ptr] !== "\n" && toml[ptr] !== "\r") {
      throw new TomlError("each key-value declaration must be followed by an end-of-line", {
        toml,
        ptr
      });
    }
    ptr = skipVoid(toml, ptr);
  }
  return res;
}

// src/languages/rust.ts
function extract2(root) {
  const symbols = collectSymbols(root, classify6);
  const hasMain = symbols.some((s) => s.kind === "function" && s.name === "main" && !s.container);
  return { symbols, imports: collectImports6(root), ...hasMain ? { entryPoint: true } : {} };
}
function classify6(node) {
  const name2 = node.childForFieldName("name")?.text;
  const exported = isPublic3(node);
  switch (node.type) {
    case "function_item":
    case "function_signature_item":
    case "macro_definition":
      return name2 ? { kind: "function", name: name2, exported } : void 0;
    case "struct_item":
    case "union_item":
      return name2 ? { kind: "struct", name: name2, exported } : void 0;
    case "enum_item":
      return name2 ? { kind: "enum", name: name2, exported } : void 0;
    case "trait_item":
      return name2 ? { kind: "trait", name: name2, exported, extends: traitBounds(node) } : void 0;
    case "type_item":
      return name2 ? { kind: "type", name: name2, exported } : void 0;
    case "const_item":
    case "static_item":
      return name2 ? { kind: "variable", name: name2, exported } : void 0;
    case "mod_item":
      return name2 && node.childForFieldName("body") ? { kind: "module", name: name2, exported } : void 0;
    case "impl_item":
      return classifyImpl(node);
    default:
      return void 0;
  }
}
function isPublic3(node) {
  return node.namedChildren.some((child) => child.type === "visibility_modifier");
}
function traitBounds(node) {
  const bounds = node.childForFieldName("bounds");
  return (bounds?.namedChildren ?? []).filter((bound) => bound.type !== "lifetime").map((bound) => bound.text);
}
function classifyImpl(node) {
  const type = node.childForFieldName("type");
  if (!type) return void 0;
  const trait = node.childForFieldName("trait");
  return {
    kind: "impl",
    name: implementedTypeName(type),
    exported: false,
    ...trait ? { extends: [trait.text] } : {}
  };
}
function implementedTypeName(type) {
  if (type.type === "generic_type") {
    const generic = type.childForFieldName("type");
    if (generic) return implementedTypeName(generic);
  }
  if (type.type === "scoped_type_identifier") return type.childForFieldName("name")?.text ?? type.text;
  return type.text;
}
function collectImports6(root) {
  const imports = [];
  forEachNode(root, (node) => {
    const line = lineOf(node);
    if (node.type === "use_declaration") {
      const argument = node.childForFieldName("argument");
      if (argument) {
        for (const leaf of expandUseTree(argument, [])) imports.push({ ...leaf, line });
      }
    } else if (node.type === "mod_item" && !node.childForFieldName("body")) {
      const name2 = node.childForFieldName("name")?.text;
      if (name2) imports.push({ specifier: `mod:${name2}`, names: [], line });
    } else if (node.type === "extern_crate_declaration") {
      const name2 = node.childForFieldName("name")?.text;
      if (name2) imports.push({ specifier: name2, names: [], line });
    }
  });
  return imports;
}
function expandUseTree(node, prefix) {
  switch (node.type) {
    case "scoped_use_list":
      return expandUseList(node, [...prefix, ...pathSegments(node.childForFieldName("path"))]);
    case "use_list":
      return expandUseList(node, prefix);
    case "use_as_clause":
      return expandUseTree(node.childForFieldName("path") ?? node, prefix);
    case "use_wildcard":
      return [{ specifier: [...prefix, ...pathSegments(node.namedChildren[0])].join("::"), names: ["*"] }];
    case "self":
      return prefix.length > 0 ? [leafOf(prefix)] : [];
    default:
      return [leafOf([...prefix, ...pathSegments(node)])];
  }
}
function expandUseList(node, prefix) {
  const list = node.type === "use_list" ? node : node.childForFieldName("list");
  return (list?.namedChildren ?? []).flatMap((child) => expandUseTree(child, prefix));
}
function leafOf(segments) {
  return { specifier: segments.join("::"), names: [segments[segments.length - 1]] };
}
function pathSegments(node) {
  if (!node) return [];
  if (node.type !== "scoped_identifier") return [node.text];
  const name2 = node.childForFieldName("name");
  return [...pathSegments(node.childForFieldName("path")), ...name2 ? [name2.text] : []];
}
var rust = {
  id: "rust",
  displayName: "Rust",
  grammar: "rust",
  extensions: [".rs"],
  ecosystem: "rust",
  extract: extract2
};
var BUILTIN_CRATES = /* @__PURE__ */ new Set(["std", "core", "alloc", "proc_macro", "test"]);
var MODULE_ROOT_FILES = /* @__PURE__ */ new Set(["mod.rs", "lib.rs", "main.rs"]);
var rustResolver = (project) => new RustResolver(project);
var RustResolver = class {
  project;
  cratesByDir = /* @__PURE__ */ new Map();
  cratesByName = /* @__PURE__ */ new Map();
  constructor(project) {
    this.project = project;
    for (const file of project.files) {
      if (baseName(file) !== "Cargo.toml") continue;
      const name2 = packageNameOf3(project.readText(file));
      if (!name2) continue;
      const crate = this.crateAt(dirOf(file));
      this.cratesByDir.set(crate.dir, crate);
      this.cratesByName.set(name2.replace(/-/g, "_"), crate);
    }
  }
  resolve(fromPath, imported) {
    const { specifier } = imported;
    if (specifier.startsWith("mod:")) return this.resolveModDeclaration(fromPath, specifier.slice("mod:".length));
    const [first, ...rest] = specifier.split("::");
    if (BUILTIN_CRATES.has(first)) return { builtin: first };
    const crate = this.crateOf(fromPath);
    if (first === "crate") return crate ? this.resolveFrom(crate, crate.srcDir, rest, fromPath) : { unresolved: true };
    if (first === "self") return this.resolveFrom(crate, moduleDirOf(fromPath), rest, fromPath);
    if (first === "super") return this.resolveSuper(crate, fromPath, rest);
    const named = this.cratesByName.get(first);
    if (named) return this.resolveFrom(named, named.srcDir, rest, fromPath);
    const siblingDir = moduleDirOf(fromPath);
    if (this.findModuleFile(siblingDir, first)) return this.resolveFrom(crate, siblingDir, [first, ...rest], fromPath);
    return { external: first };
  }
  crateAt(dir) {
    const srcDir = joinRepoPath(dir, "src") ?? "src";
    const root = [`${srcDir}/lib.rs`, `${srcDir}/main.rs`].find((candidate) => this.project.files.has(candidate));
    return { dir, srcDir, root };
  }
  crateOf(file) {
    for (const dir of ancestorDirs(file)) {
      const crate = this.cratesByDir.get(dir);
      if (crate) return crate;
    }
    return void 0;
  }
  resolveModDeclaration(fromPath, name2) {
    const file = this.findModuleFile(moduleDirOf(fromPath), name2);
    return file ? { target: file } : { unresolved: true };
  }
  /** `super::` climbs one module per segment; a module's children live in its own directory. */
  resolveSuper(crate, fromPath, segments) {
    let dir = moduleDirOf(fromPath);
    let rest = segments;
    while (true) {
      dir = dirOf(dir);
      if (rest[0] !== "super") break;
      rest = rest.slice(1);
    }
    if (crate && !isWithin(dir, crate.srcDir)) return { unresolved: true };
    return this.resolveFrom(crate, dir, rest, fromPath);
  }
  /** Longest module path wins; with no module file the items live in the module at `baseDir` itself. */
  resolveFrom(crate, baseDir, segments, fromPath) {
    const file = this.findLongestModulePath(baseDir, segments) ?? this.moduleFileOf(crate, baseDir);
    return file && file !== fromPath ? { target: file } : { unresolved: true };
  }
  findLongestModulePath(baseDir, segments) {
    for (let length = segments.length; length >= 1; length--) {
      const parentDir = joinRepoPath(baseDir, ...segments.slice(0, length - 1));
      const file = parentDir === void 0 ? void 0 : this.findModuleFile(parentDir, segments[length - 1]);
      if (file) return file;
    }
    return void 0;
  }
  findModuleFile(parentDir, name2) {
    const candidates = [joinRepoPath(parentDir, `${name2}.rs`), joinRepoPath(parentDir, name2, "mod.rs")];
    return candidates.find((candidate) => candidate !== void 0 && this.project.files.has(candidate));
  }
  /** The file defining the module whose children live in `dir`. */
  moduleFileOf(crate, dir) {
    if (!crate) return void 0;
    if (dir === crate.srcDir) return crate.root;
    return [`${dir}.rs`, `${dir}/mod.rs`].find((candidate) => this.project.files.has(candidate));
  }
};
function moduleDirOf(file) {
  const dir = dirOf(file);
  const isModuleRoot = MODULE_ROOT_FILES.has(baseName(file)) || /(^|\/)src\/bin$/.test(dir);
  return isModuleRoot ? dir : joinRepoPath(dir, stemOf(file)) ?? dir;
}
function packageNameOf3(cargoToml) {
  if (cargoToml === void 0) return void 0;
  try {
    const pkg = parse(cargoToml).package;
    return pkg && typeof pkg === "object" && "name" in pkg && typeof pkg.name === "string" ? pkg.name : void 0;
  } catch {
    return void 0;
  }
}

// src/languages/swift.ts
var DECLARATION_KEYWORDS = {
  class: "class",
  actor: "class",
  struct: "struct",
  enum: "enum",
  extension: "extension"
};
var EXPORTED_ACCESS = /* @__PURE__ */ new Set(["public", "open"]);
var SKIPPED_TYPES4 = /* @__PURE__ */ new Set([
  "lambda_literal",
  "deinit_declaration",
  "subscript_declaration",
  "protocol_property_declaration",
  "enum_entry"
]);
function extractSwift(root, source) {
  return {
    symbols: collectSymbols(root, classify7),
    imports: collectImports7(root),
    .../^\s*@main\b/m.test(source) ? { entryPoint: true } : {}
  };
}
function classify7(node) {
  switch (node.type) {
    case "class_declaration":
      return classifyDeclaration(node);
    case "protocol_declaration":
      return { kind: "protocol", name: nameOf(node), exported: isExported3(node), extends: heritage4(node) };
    case "function_declaration":
    case "protocol_function_declaration":
      return { kind: "function", name: nameOf(node), exported: isExported3(node) };
    case "init_declaration":
      return { kind: "method", name: "init", exported: isExported3(node) };
    case "typealias_declaration":
      return { kind: "type", name: nameOf(node), exported: isExported3(node) };
    case "property_declaration":
      return classifyProperty2(node);
    default:
      return SKIPPED_TYPES4.has(node.type) ? "skip" : void 0;
  }
}
function classifyDeclaration(node) {
  const keyword = node.children.find((child) => !child.isNamed && child.type in DECLARATION_KEYWORDS);
  if (!keyword) return void 0;
  return {
    kind: DECLARATION_KEYWORDS[keyword.type],
    name: nameOf(node),
    exported: isExported3(node),
    extends: heritage4(node)
  };
}
function classifyProperty2(node) {
  if (node.parent?.type !== "source_file") return "skip";
  const name2 = node.childForFieldName("name")?.childForFieldName("bound_identifier")?.text;
  return name2 ? { kind: "variable", name: name2, exported: isExported3(node) } : "skip";
}
function nameOf(node) {
  return node.childForFieldName("name")?.text ?? "";
}
function accessModifiers(node) {
  const modifiers = node.namedChildren.find((child) => child.type === "modifiers");
  return (modifiers?.namedChildren ?? []).filter((child) => child.type === "visibility_modifier").map((child) => child.text);
}
function isExported3(node) {
  const explicit = accessModifiers(node);
  if (explicit.length > 0) return explicit.some((modifier) => EXPORTED_ACCESS.has(modifier));
  const owner = node.parent?.parent;
  return owner ? inheritsAccess(owner) && isExported3(owner) : false;
}
function inheritsAccess(owner) {
  if (owner.type === "protocol_declaration") return true;
  return owner.type === "class_declaration" && owner.children.some((child) => child.type === "extension");
}
function heritage4(node) {
  return node.namedChildren.filter((child) => child.type === "inheritance_specifier").map((specifier) => specifier.childForFieldName("inherits_from")?.text ?? specifier.text);
}
function collectImports7(root) {
  return root.namedChildren.filter((child) => child.type === "import_declaration").flatMap((declaration) => {
    const path = declaration.namedChildren.find((child) => child.type === "identifier");
    if (!path) return [];
    return [{ specifier: path.text.split(".")[0], names: [], line: lineOf(declaration) }];
  });
}
var swift = {
  id: "swift",
  displayName: "Swift",
  grammar: "swift",
  extensions: [".swift"],
  ecosystem: "swift",
  extract: extractSwift
};
var PLATFORM_MODULES = /* @__PURE__ */ new Set([
  "Foundation",
  "FoundationNetworking",
  "FoundationEssentials",
  "UIKit",
  "SwiftUI",
  "AppKit",
  "Cocoa",
  "Combine",
  "Dispatch",
  "Darwin",
  "Glibc",
  "os",
  "ObjectiveC",
  "Swift",
  "XCTest",
  "Testing",
  "Security",
  "Network",
  "SwiftData",
  "Observation",
  "Accelerate",
  "Metal",
  "Vision",
  "Speech",
  "Photos",
  "Contacts",
  "Intents",
  "UserNotifications",
  "Charts",
  "TipKit",
  "RegexBuilder",
  "AVFoundation",
  "WebKit"
]);
var PLATFORM_FRAMEWORK_NAME = /^Core[A-Z]|Kit$/;
var swiftResolver = (project) => {
  const modules = buildModuleIndex(project);
  return {
    resolve(_fromPath, imported) {
      const dir = modules.get(imported.specifier);
      if (dir !== void 0) return { target: dir };
      const isPlatform = PLATFORM_MODULES.has(imported.specifier) || PLATFORM_FRAMEWORK_NAME.test(imported.specifier);
      return isPlatform ? { builtin: imported.specifier } : { external: imported.specifier };
    }
  };
};
function buildModuleIndex(project) {
  const modules = /* @__PURE__ */ new Map();
  for (const dir of directoriesWithSwiftFiles(project).sort(byDepthThenName)) {
    if (!modules.has(baseName(dir))) modules.set(baseName(dir), dir);
  }
  for (const dir of project.dirs) {
    if (isSwiftPmTarget(dir, project.files)) modules.set(baseName(dir), dir);
  }
  return modules;
}
function directoriesWithSwiftFiles(project) {
  const dirs = /* @__PURE__ */ new Set();
  for (const entry of project.entries.values()) {
    if (entry.language !== "swift") continue;
    for (const dir of ancestorDirs(entry.path)) if (dir !== "") dirs.add(dir);
  }
  return [...dirs];
}
function isSwiftPmTarget(dir, files) {
  const sources = dirOf(dir);
  if (dir === "" || baseName(sources) !== "Sources") return false;
  const manifest = joinRepoPath(dirOf(sources), "Package.swift");
  return manifest !== void 0 && files.has(manifest);
}
function byDepthThenName(a, b) {
  return a.split("/").length - b.split("/").length || a.localeCompare(b);
}

// src/languages/typescript.ts
function extractScript(root, source) {
  return {
    symbols: collectSymbols(root, classify8),
    imports: collectImports8(root),
    ...source.startsWith("#!") ? { entryPoint: true } : {}
  };
}
var FUNCTION_VALUES = /* @__PURE__ */ new Set(["arrow_function", "function_expression", "function", "generator_function"]);
var SKIPPED_EXPRESSIONS = FUNCTION_VALUES;
function classify8(node) {
  const exported = node.parent?.type === "export_statement";
  const name2 = node.childForFieldName("name")?.text;
  switch (node.type) {
    case "class_declaration":
    case "abstract_class_declaration":
      return name2 ? { kind: "class", name: name2, exported, extends: classHeritage(node) } : void 0;
    case "interface_declaration":
      return name2 ? { kind: "interface", name: name2, exported, extends: interfaceHeritage(node) } : void 0;
    case "type_alias_declaration":
      return name2 ? { kind: "type", name: name2, exported } : void 0;
    case "enum_declaration":
      return name2 ? { kind: "enum", name: name2, exported } : void 0;
    case "function_declaration":
    case "generator_function_declaration":
    case "function_signature":
      return name2 ? { kind: "function", name: name2, exported } : void 0;
    case "method_definition":
    case "abstract_method_signature":
      return name2 ? { kind: "method", name: name2, exported: !isPrivateMember(node) } : void 0;
    case "public_field_definition":
      return classifyField(node, name2);
    case "internal_module":
    case "module":
      return name2 ? { kind: "namespace", name: unquote(name2), exported } : void 0;
    case "variable_declarator":
      return classifyDeclarator(node, name2);
    case "assignment_expression":
      return classifyCommonJsExport(node);
    default:
      return SKIPPED_EXPRESSIONS.has(node.type) ? "skip" : void 0;
  }
}
function classifyField(node, name2) {
  const value = node.childForFieldName("value");
  if (!name2 || !value || !FUNCTION_VALUES.has(value.type)) return "skip";
  return { kind: "method", name: name2, exported: !isPrivateMember(node) };
}
function classifyDeclarator(node, name2) {
  const declaration = node.parent;
  const exported = declaration?.parent?.type === "export_statement";
  const value = node.childForFieldName("value");
  if (!name2 || node.childForFieldName("name")?.type !== "identifier") return "skip";
  if (value && FUNCTION_VALUES.has(value.type)) return { kind: "function", name: name2, exported };
  if (exported) return { kind: "variable", name: name2, exported };
  return "skip";
}
function classifyCommonJsExport(node) {
  const target = node.childForFieldName("left");
  if (target?.type !== "member_expression") return "skip";
  const owner = target.childForFieldName("object")?.text;
  const name2 = target.childForFieldName("property")?.text;
  if (!name2 || owner !== "exports" && owner !== "module.exports") return "skip";
  const value = node.childForFieldName("right");
  const kind = value && FUNCTION_VALUES.has(value.type) ? "function" : "variable";
  return { kind, name: name2, exported: true };
}
function isPrivateMember(node) {
  const nameNode = node.childForFieldName("name");
  if (nameNode?.type === "private_property_identifier") return true;
  return node.children.some(
    (child) => child.type === "accessibility_modifier" && child.text !== "public"
  );
}
function classHeritage(node) {
  const heritage5 = node.namedChildren.find((child) => child.type === "class_heritage");
  if (!heritage5) return [];
  return heritage5.namedChildren.flatMap((clause) => {
    if (clause.type === "extends_clause") return clause.childrenForFieldName("value").map((v) => v.text);
    if (clause.type === "implements_clause") return clause.namedChildren.map((t) => t.text);
    return [clause.text];
  });
}
function interfaceHeritage(node) {
  const clause = node.namedChildren.find((child) => child.type === "extends_type_clause");
  return clause ? clause.namedChildren.map((t) => t.text) : [];
}
function collectImports8(root) {
  const imports = [];
  forEachNode(root, (node) => {
    const found = importOf(node);
    if (found) imports.push(found);
  });
  return imports;
}
function importOf(node) {
  if (node.type === "import_statement" || node.type === "export_statement") {
    const source = node.childForFieldName("source");
    if (!source) return void 0;
    return { specifier: unquote(source.text), names: importedNames(node), line: lineOf(node) };
  }
  if (node.type === "call_expression") {
    const callee = node.childForFieldName("function");
    const isLoader = callee?.type === "import" || callee?.type === "identifier" && callee.text === "require";
    const first = node.childForFieldName("arguments")?.namedChildren[0];
    if (!isLoader || first?.type !== "string") return void 0;
    return { specifier: unquote(first.text), names: [], line: lineOf(node) };
  }
  return void 0;
}
function importedNames(statement) {
  const names = [];
  forEachNode(statement, (node) => {
    if (node.type === "import_specifier" || node.type === "export_specifier") {
      const name2 = node.childForFieldName("name")?.text;
      if (name2) names.push(name2);
      return false;
    }
    if (node.type === "namespace_import" || node.type === "namespace_export") {
      names.push("*");
      return false;
    }
    if (node.type === "identifier" && node.parent?.type === "import_clause") names.push("default");
    return node.type !== "string";
  });
  if (statement.type === "export_statement" && names.length === 0) names.push("*");
  return names;
}
var typescript = {
  id: "typescript",
  displayName: "TypeScript",
  grammar: "typescript",
  extensions: [".ts", ".mts", ".cts"],
  ecosystem: "node",
  extract: extractScript
};
var tsx = {
  id: "tsx",
  displayName: "TSX",
  grammar: "tsx",
  extensions: [".tsx"],
  ecosystem: "node",
  extract: extractScript
};
var javascript = {
  id: "javascript",
  displayName: "JavaScript",
  grammar: "javascript",
  extensions: [".js", ".mjs", ".cjs", ".jsx"],
  ecosystem: "node",
  extract: extractScript
};

// src/languages/index.ts
var LANGUAGES = [
  typescript,
  tsx,
  javascript,
  python,
  go,
  rust,
  java,
  kotlin,
  csharp,
  swift
];
var RESOLVERS = {
  node: nodeResolver,
  python: pythonResolver,
  go: goResolver,
  rust: rustResolver,
  jvm: jvmResolver,
  dotnet: dotnetResolver,
  swift: swiftResolver
};
var byExtension = new Map(
  LANGUAGES.flatMap((language) => language.extensions.map((ext) => [ext, language]))
);
function languageForPath(path) {
  if (path.endsWith(".d.ts")) return typescript;
  return byExtension.get(extensionOf(path));
}

// src/scan/file-types.ts
var FILE_TYPES = {
  ".c": "C",
  ".h": "C header",
  ".cc": "C++",
  ".cpp": "C++",
  ".hpp": "C++ header",
  ".m": "Objective-C",
  ".mm": "Objective-C++",
  ".rb": "Ruby",
  ".php": "PHP",
  ".scala": "Scala",
  ".dart": "Dart",
  ".lua": "Lua",
  ".ex": "Elixir",
  ".exs": "Elixir",
  ".sh": "Shell",
  ".bash": "Shell",
  ".zsh": "Shell",
  ".ps1": "PowerShell",
  ".sql": "SQL",
  ".graphql": "GraphQL",
  ".gql": "GraphQL",
  ".proto": "Protocol Buffers",
  ".html": "HTML",
  ".htm": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",
  ".sass": "Sass",
  ".less": "Less",
  ".vue": "Vue",
  ".svelte": "Svelte",
  ".astro": "Astro",
  ".json": "JSON",
  ".jsonc": "JSON",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".toml": "TOML",
  ".xml": "XML",
  ".ini": "INI",
  ".env": "Env",
  ".md": "Markdown",
  ".mdx": "MDX",
  ".rst": "reStructuredText",
  ".txt": "Text",
  ".csv": "CSV",
  ".gradle": "Gradle",
  ".csproj": "MSBuild",
  ".sln": "Visual Studio solution",
  ".tf": "Terraform",
  ".prisma": "Prisma",
  ".svg": "SVG",
  ".png": "PNG",
  ".jpg": "JPEG",
  ".jpeg": "JPEG",
  ".gif": "GIF",
  ".webp": "WebP",
  ".ico": "Icon",
  ".woff": "Font",
  ".woff2": "Font",
  ".ttf": "Font",
  ".otf": "Font",
  ".mp3": "Audio",
  ".wav": "Audio",
  ".mp4": "Video",
  ".mov": "Video",
  ".pdf": "PDF",
  ".lock": "Lockfile",
  ".storyboard": "Storyboard",
  ".xib": "Interface Builder",
  ".plist": "Property list",
  ".xcconfig": "Xcode config",
  ".pbxproj": "Xcode project"
};
var NAMED_TYPES = {
  Dockerfile: "Dockerfile",
  Makefile: "Makefile",
  Procfile: "Procfile",
  Gemfile: "Gemfile",
  Rakefile: "Ruby",
  "package-lock.json": "Lockfile",
  "pnpm-lock.yaml": "Lockfile",
  "yarn.lock": "Lockfile",
  "Cargo.lock": "Lockfile",
  "go.sum": "Lockfile",
  "go.mod": "Go module",
  "Package.resolved": "Lockfile",
  "poetry.lock": "Lockfile",
  "uv.lock": "Lockfile"
};
var DOC_EXTENSIONS = /* @__PURE__ */ new Set([".md", ".mdx", ".rst", ".txt", ".adoc"]);
var ASSET_EXTENSIONS = /* @__PURE__ */ new Set([
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".mp3",
  ".wav",
  ".mp4",
  ".mov",
  ".pdf"
]);
var CONFIG_EXTENSIONS = /* @__PURE__ */ new Set([
  ".json",
  ".jsonc",
  ".yaml",
  ".yml",
  ".toml",
  ".xml",
  ".ini",
  ".env",
  ".lock",
  ".gradle",
  ".csproj",
  ".sln",
  ".plist",
  ".xcconfig",
  ".pbxproj",
  ".tf"
]);
var DATA_EXTENSIONS = /* @__PURE__ */ new Set([".csv"]);
var CODE_EXTENSIONS = new Set(Object.keys(FILE_TYPES).filter(
  (ext) => !DOC_EXTENSIONS.has(ext) && !ASSET_EXTENSIONS.has(ext) && !CONFIG_EXTENSIONS.has(ext) && !DATA_EXTENSIONS.has(ext)
));
var TEST_PATH = /(^|\/)(__tests__|__mocks__|tests?|spec|specs|testing|e2e|src\/test)\/|\.(test|spec|e2e)\.[cm]?[jt]sx?$|_test\.(go|py)$|(^|\/)test_[^/]+\.py$|Tests?\.(swift|kt|java|cs)$/;
var CONFIG_NAME = /(^|\/)(\.[^/]+rc(\.\w+)?|[^/]+\.config\.[cm]?[jt]s|Dockerfile[^/]*|Makefile|Procfile|\.env[^/]*|\.gitignore|\.dockerignore|\.editorconfig)$/;
function fileTypeOf(path) {
  const name2 = baseName(path);
  return NAMED_TYPES[name2] ?? (name2.startsWith("Dockerfile") ? "Dockerfile" : FILE_TYPES[extensionOf(path)]);
}
function categoryOf(path, isParsedCode) {
  const ext = extensionOf(path);
  if ((isParsedCode || CODE_EXTENSIONS.has(ext)) && TEST_PATH.test(path)) return "test";
  if (CONFIG_NAME.test(path) || CONFIG_EXTENSIONS.has(ext) || NAMED_TYPES[baseName(path)]) return "config";
  if (isParsedCode || CODE_EXTENSIONS.has(ext)) return "code";
  if (DOC_EXTENSIONS.has(ext) || /(^|\/)(LICENSE|CHANGELOG|README|CONTRIBUTING)[^/]*$/i.test(path)) return "docs";
  if (ASSET_EXTENSIONS.has(ext)) return "asset";
  return "other";
}

// src/map/analyze-file.ts
var MAX_PARSED_BYTES = 1024 * 1024;
var MINIFIED_AVERAGE_LINE_LENGTH = 300;
var BINARY_SNIFF_BYTES = 8e3;
function hashContent(content) {
  return createHash2("sha256").update(content).digest("hex").slice(0, 16);
}
async function analyzeFile(path, content, parser) {
  const language = languageForPath(path);
  const isBinary = content.subarray(0, BINARY_SNIFF_BYTES).includes(0);
  const text = isBinary ? "" : content.toString("utf8");
  const lines = isBinary ? 0 : countLines(text);
  const entry = {
    path,
    hash: hashContent(content),
    bytes: content.length,
    lines,
    category: categoryOf(path, language !== void 0),
    symbols: [],
    imports: []
  };
  const fileType = language?.displayName ?? fileTypeOf(path);
  if (fileType) entry.fileType = fileType;
  if (!language) return entry;
  entry.language = language.id;
  const skipped = skipReason(content.length, lines, isBinary);
  if (skipped) return { ...entry, skipped };
  try {
    const extraction = await parser.parse(language, text, (root) => language.extract(root, text));
    return {
      ...entry,
      symbols: extraction.symbols,
      imports: extraction.imports,
      ...extraction.packageName ? { packageName: extraction.packageName } : {},
      ...extraction.entryPoint || baseName(path) === "main.swift" ? { entryPoint: true } : {}
    };
  } catch (error) {
    return { ...entry, skipped: `parse failed: ${error.message}` };
  }
}
function skipReason(bytes, lines, isBinary) {
  if (isBinary) return "binary";
  if (bytes > MAX_PARSED_BYTES) return "larger than 1 MB";
  if (lines > 0 && bytes / lines > MINIFIED_AVERAGE_LINE_LENGTH) return "minified or generated";
  return void 0;
}
function countLines(text) {
  if (text.length === 0) return 0;
  let count = 1;
  for (let i2 = 0; i2 < text.length; i2++) if (text.charCodeAt(i2) === 10) count++;
  return text.endsWith("\n") ? count - 1 : count;
}

// src/map/manifests.ts
function readManifests(paths, readText) {
  const manifests = [];
  for (const path of paths) {
    const reader = readerFor(path);
    const text = reader && readText(path);
    if (!reader || text === void 0) continue;
    try {
      const manifest = reader(path, text);
      if (manifest) manifests.push({ path, ...manifest });
    } catch {
    }
  }
  return manifests;
}
function readerFor(path) {
  const name2 = baseName(path);
  if (name2 === "package.json") return readPackageJson;
  if (name2 === "pyproject.toml") return readPyproject;
  if (/^requirements[\w.-]*\.txt$/.test(name2)) return readRequirements;
  if (name2 === "go.mod") return readGoMod;
  if (name2 === "Cargo.toml") return readCargo;
  if (name2 === "Package.swift") return readSwiftPackage;
  if (name2 === "build.gradle" || name2 === "build.gradle.kts") return readGradle;
  if (name2 === "pom.xml") return readPom;
  if (name2.endsWith(".csproj")) return readCsproj;
  return void 0;
}
var readPackageJson = (path, text) => {
  const json = parseJsonc(text);
  if (!json) return void 0;
  const dir = dirOf(path);
  const dependencies = [
    ...fromRecord(json.dependencies),
    ...fromRecord(json.peerDependencies),
    ...fromRecord(json.optionalDependencies),
    ...fromRecord(json.devDependencies, true)
  ];
  const bin = typeof json.bin === "string" ? [json.bin] : Object.values(json.bin ?? {});
  const entries = [json.main, json.module, ...bin].filter((e) => typeof e === "string");
  return {
    ecosystem: "npm",
    name: typeof json.name === "string" ? json.name : void 0,
    dependencies,
    entryPoints: entries.map((entry) => joinRepoPath(dir, entry)).filter((e) => e !== void 0)
  };
};
function fromRecord(record, dev = false) {
  if (!record || typeof record !== "object") return [];
  return Object.entries(record).map(([name2, version]) => ({
    name: name2,
    ...typeof version === "string" ? { version } : {},
    ...dev ? { dev: true } : {}
  }));
}
function pep508(spec) {
  const match = spec.trim().match(/^([A-Za-z0-9][A-Za-z0-9._-]*)(?:\[[^\]]*\])?\s*([^;]*)/);
  if (!match) return void 0;
  const version = match[2].trim();
  return { name: match[1], ...version ? { version } : {} };
}
var readPyproject = (_path, text) => {
  const toml = parse(text);
  const project = toml.project ?? {};
  const poetry = toml.tool?.poetry ?? {};
  const dependencies = [
    ...(project.dependencies ?? []).map(pep508),
    ...Object.values(project["optional-dependencies"] ?? {}).flat().map(pep508),
    ...toml["dependency-groups"] ? Object.values(toml["dependency-groups"]).flat().filter((d) => typeof d === "string").map((d) => ({ ...pep508(d), dev: true })) : [],
    ...fromRecord(poetry.dependencies).filter((d) => d.name !== "python"),
    ...fromRecord(poetry.group?.dev?.dependencies ?? poetry["dev-dependencies"], true)
  ].filter((d) => d !== void 0);
  return {
    ecosystem: "python",
    name: project.name ?? poetry.name,
    dependencies,
    // Console scripts name modules (`pkg.cli:main`), not files; `__main__` detection covers them.
    entryPoints: []
  };
};
var readRequirements = (_path, text) => ({
  ecosystem: "python",
  dependencies: text.split("\n").map((line) => line.replace(/#.*/, "").trim()).filter((line) => line && !line.startsWith("-")).map(pep508).filter((d) => d !== void 0),
  entryPoints: []
});
var readGoMod = (_path, text) => {
  const name2 = text.match(/^module\s+(\S+)/m)?.[1];
  const dependencies = [];
  const requireLine = /^\s*(?:require\s+)?([\w.-]+\.[\w.-]+\/\S+)\s+(v\S+)(\s*\/\/\s*indirect)?/gm;
  for (const match of text.matchAll(requireLine)) {
    if (!match[3]) dependencies.push({ name: match[1], version: match[2] });
  }
  return { ecosystem: "go", name: name2, dependencies, entryPoints: [] };
};
var readCargo = (path, text) => {
  const toml = parse(text);
  const dir = dirOf(path);
  const cargoDeps = (table, dev = false) => Object.entries(table ?? {}).map(([name2, spec]) => {
    const version = typeof spec === "string" ? spec : spec?.version;
    return { name: name2, ...version ? { version } : {}, ...dev ? { dev: true } : {} };
  });
  const bins = (toml.bin ?? []).map((bin) => bin.path).filter(Boolean);
  return {
    ecosystem: "cargo",
    name: toml.package?.name,
    dependencies: [
      ...cargoDeps(toml.dependencies),
      ...cargoDeps(toml["dev-dependencies"], true),
      ...cargoDeps(toml.workspace?.dependencies)
    ],
    entryPoints: bins.map((bin) => joinRepoPath(dir, bin)).filter((e) => e !== void 0)
  };
};
var readSwiftPackage = (_path, text) => ({
  ecosystem: "swiftpm",
  name: text.match(/name:\s*"([^"]+)"/)?.[1],
  dependencies: [...text.matchAll(/\.package\(\s*(?:name:\s*"[^"]*",\s*)?(?:url|path):\s*"([^"]+)"(?:[^)]*?(?:from|exact|branch|revision):\s*"([^"]+)")?/g)].map(
    (match) => ({ name: match[1].replace(/\.git$/, "").split("/").pop(), ...match[2] ? { version: match[2] } : {} })
  ),
  entryPoints: []
});
var readGradle = (_path, text) => ({
  ecosystem: "gradle",
  dependencies: [
    ...text.matchAll(/\b(implementation|api|compileOnly|runtimeOnly|kapt|ksp|testImplementation|androidTestImplementation)\s*\(?\s*["']([^"':]+:[^"':]+)(?::([^"']+))?["']/g)
  ].map((match) => ({
    name: match[2],
    ...match[3] ? { version: match[3] } : {},
    .../^(test|androidTest)/.test(match[1]) ? { dev: true } : {}
  })),
  entryPoints: []
});
var readPom = (_path, text) => {
  const body2 = text.replace(/<!--[\s\S]*?-->/g, "");
  const dependencies = [...body2.matchAll(/<dependency>([\s\S]*?)<\/dependency>/g)].map((match) => {
    const tag = (name2) => match[1].match(new RegExp(`<${name2}>([^<]+)</${name2}>`))?.[1]?.trim();
    const version = tag("version");
    return {
      name: `${tag("groupId")}:${tag("artifactId")}`,
      ...version ? { version } : {},
      ...tag("scope") === "test" ? { dev: true } : {}
    };
  });
  const withoutDependencies = body2.replace(/<(dependencies|parent|build|dependencyManagement)>[\s\S]*?<\/\1>/g, "");
  return {
    ecosystem: "maven",
    name: withoutDependencies.match(/<artifactId>([^<]+)<\/artifactId>/)?.[1],
    dependencies,
    entryPoints: []
  };
};
var readCsproj = (path, text) => ({
  ecosystem: "nuget",
  name: baseName(path).replace(/\.csproj$/, ""),
  dependencies: [...text.matchAll(/<PackageReference\s+Include="([^"]+)"(?:\s+Version="([^"]+)")?/g)].map((match) => ({
    name: match[1],
    ...match[2] ? { version: match[2] } : {}
  })),
  entryPoints: []
});

// src/map/resolve-imports.ts
function resolveImports(entries, project) {
  const resolvers = /* @__PURE__ */ new Map();
  const resolverFor = (ecosystem) => {
    if (!resolvers.has(ecosystem)) resolvers.set(ecosystem, RESOLVERS[ecosystem](project));
    return resolvers.get(ecosystem);
  };
  return entries.map((entry) => {
    const language = languageForPath(entry.path);
    const resolver = language && resolverFor(language.ecosystem);
    if (!resolver || entry.imports.length === 0) return entry;
    const imports = entry.imports.map((imported) => resolveOne(resolver, entry.path, imported));
    return { ...entry, imports };
  });
}
function resolveOne(resolver, fromPath, imported) {
  const raw = { specifier: imported.specifier, names: imported.names, line: imported.line };
  const resolution = resolver.resolve(fromPath, raw);
  if ("target" in resolution) return resolution.target === fromPath ? raw : { ...raw, target: resolution.target };
  if ("external" in resolution) return { ...raw, external: resolution.external };
  if ("builtin" in resolution) return { ...raw, builtin: true };
  return raw;
}

// src/map/update-map.ts
var INDEX_FILE = "index.json";
var STAT_CACHE_FILE = ".cache/stat.json";
var EXTRACTOR_VERSION = 2;
async function updateMap(folder) {
  const root = folder.root;
  const paths = listProjectFiles({ root, exclude: [...folder.config.exclude, `${folder.relativeDir}/`] });
  const previousIndex = folder.readJson(INDEX_FILE);
  const previous = new Map((previousIndex?.files ?? []).map((entry) => [entry.path, entry]));
  const cached2 = folder.readJson(STAT_CACHE_FILE);
  const extractorCurrent = cached2?.extractorVersion === EXTRACTOR_VERSION;
  const stats = extractorCurrent ? cached2.files : {};
  const nextStats = {};
  let parser;
  const added = [];
  const changed = [];
  const entries = [];
  for (const path of paths) {
    const absolute = join7(root, path);
    const stat = statSync2(absolute);
    const prior = previous.get(path);
    const known = stats[path];
    if (prior && known && known.mtimeMs === stat.mtimeMs && known.size === stat.size && known.hash === prior.hash) {
      entries.push(prior);
      nextStats[path] = known;
      continue;
    }
    const content = readFileSync6(absolute);
    const hash = hashContent(content);
    nextStats[path] = { mtimeMs: stat.mtimeMs, size: stat.size, hash };
    if (prior && prior.hash === hash && extractorCurrent) {
      entries.push(prior);
      continue;
    }
    parser ??= await SourceParser.create();
    entries.push(await analyzeFile(path, content, parser));
    (prior ? changed : added).push(path);
  }
  const removed = [...previous.keys()].filter((path) => !nextStats[path]);
  const project = projectContext(root, entries);
  const index = {
    schema: 1,
    generator: GENERATOR_NAME,
    projectName: basename(root),
    files: resolveImports(entries, project),
    manifests: readManifests(paths, project.readText)
  };
  const summaries = new SummaryBook(folder.readJson(SUMMARIES_FILE) ?? emptySummaries(), index);
  summaries.pruneRemoved();
  const written = await writeMapOutputs(folder, index, summaries);
  if (folder.writeIfChanged(INDEX_FILE, serializeIndex(index))) written.push(INDEX_FILE);
  folder.writeJson(STAT_CACHE_FILE, { extractorVersion: EXTRACTOR_VERSION, files: nextStats });
  const pending = summaries.pending();
  return {
    added,
    changed,
    removed,
    fileCount: entries.length,
    pendingFileSummaries: pending.files.length,
    pendingDirSummaries: pending.dirs.length,
    written
  };
}
function serializeIndex(index) {
  const { files, manifests, ...header2 } = index;
  const fields = Object.entries(header2).map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
  const list = (items) => items.map((item) => `    ${JSON.stringify(item)}`).join(",\n");
  return `{
${fields.join(",\n")},
  "manifests": [
${list(manifests)}
  ],
  "files": [
${list(files)}
  ]
}
`;
}
function projectContext(root, entries) {
  const files = new Set(entries.map((entry) => entry.path));
  const dirs = new Set(entries.flatMap((entry) => ancestorDirs(entry.path)));
  const texts = /* @__PURE__ */ new Map();
  return {
    files,
    dirs,
    entries: new Map(entries.filter((entry) => entry.language).map((entry) => [entry.path, entry])),
    readText(path) {
      if (!files.has(path)) return void 0;
      if (!texts.has(path)) texts.set(path, readFileSync6(join7(root, path), "utf8"));
      return texts.get(path);
    }
  };
}

// src/watch.ts
import { watch } from "node:fs";
var DEBOUNCE_MS = 400;
var IGNORED_SEGMENTS = /(^|\/)(\.git|node_modules|\.venv|__pycache__|\.next|\.turbo|DerivedData|\.build)(\/|$)/;
function watchProject(folder, onUpdate, onError) {
  const mapDir = folder.relativeDir;
  let timer;
  let running = false;
  let dirty = false;
  const run2 = async () => {
    if (running) {
      dirty = true;
      return;
    }
    running = true;
    try {
      onUpdate(await updateMap(folder));
    } catch (error) {
      onError(error);
    } finally {
      running = false;
      if (dirty) {
        dirty = false;
        void run2();
      }
    }
  };
  const watcher = watch(folder.root, { recursive: true }, (_event, filename) => {
    const path = filename?.toString().split("\\").join("/");
    if (!path || IGNORED_SEGMENTS.test(path) || path === mapDir || path.startsWith(`${mapDir}/`)) return;
    clearTimeout(timer);
    timer = setTimeout(() => void run2(), DEBOUNCE_MS);
  });
  return () => {
    clearTimeout(timer);
    watcher.close();
  };
}

// src/cli.ts
var USAGE = `mfmap: build and maintain an agent-readable map of a codebase.

Usage:
  mfmap init <folder> [--root <dir>] [--no-pointer]
      Create the map in <folder> (relative to the project root), build it, and add a
      pointer to the top of AGENTS.md and CLAUDE.md when they exist.
  mfmap update [--map <folder>] [--quiet]
      Re-scan and rewrite the map. Only files whose content changed are re-parsed.
  mfmap graph [--map <folder>] [--open]
      Update the map and print the path of graph.html, an interactive network view of files,
      folders, and imports. --open opens it in the default browser.
  mfmap watch [--map <folder>]
      Keep the map updated while files change.
  mfmap summaries pending [--map <folder>] [--json] [--limit <n>]
      List files and directories that need a new or refreshed summary.
  mfmap summaries set [--map <folder>] [--input <file.json>]
      Record summaries from JSON ({"files": {path: text}, "dirs": {path: text}}) on stdin or --input.
  mfmap hooks install|uninstall [--agent claude,cursor,codex|all] [--map <folder>]
      Add or remove hooks that run update after agent edits and at the end of each turn.
      claude: .claude/settings.local.json  cursor: .cursor/hooks.json  codex: .codex/hooks.json
      (default: claude). Codex asks you to trust new repo hooks once via /hooks.
  mfmap pointer [--map <folder>]
      Add or refresh the map pointer at the top of AGENTS.md and CLAUDE.md.

Without --map, the map folder is found from the current directory (any folder holding ${CONFIG_FILE}).`;
async function main(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      map: { type: "string" },
      root: { type: "string" },
      input: { type: "string" },
      limit: { type: "string" },
      json: { type: "boolean", default: false },
      open: { type: "boolean", default: false },
      quiet: { type: "boolean", default: false },
      agent: { type: "string" },
      "no-pointer": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false }
    }
  });
  const [command, subcommand] = positionals;
  if (values.help || !command) {
    console.log(USAGE);
    return command || values.help ? 0 : 1;
  }
  switch (command) {
    case "init":
      return init2(subcommand, values.root, !values["no-pointer"]);
    case "update": {
      const report = await updateMap(openMap(values.map));
      if (!values.quiet) printReport(report);
      return 0;
    }
    case "graph":
      return showGraph(openMap(values.map), values.open);
    case "watch":
      return watchMap(openMap(values.map));
    case "summaries":
      if (subcommand === "pending") return listPending(openMap(values.map), values.json, Number(values.limit ?? 0));
      if (subcommand === "set") return setSummaries(openMap(values.map), values.input);
      throw new UsageError('summaries needs "pending" or "set".');
    case "hooks": {
      const folder = openMap(values.map);
      const agents = parseAgents(values.agent);
      if (subcommand === "install") {
        for (const path of installHooks(folder.root, folder.dir, agents)) console.log(`Installed hooks in ${path}`);
        if (agents.includes("codex")) console.log("Codex: run /hooks in Codex once to review and trust the new repo hooks.");
      } else if (subcommand === "uninstall") {
        const cleaned = uninstallHooks(folder.root, agents);
        console.log(cleaned.length ? `Removed mfmap hooks from ${cleaned.join(", ")}` : "No hook settings files found.");
      } else {
        throw new UsageError('hooks needs "install" or "uninstall".');
      }
      return 0;
    }
    case "pointer": {
      const folder = openMap(values.map);
      console.log(describePointerResults(writeInstructionPointers(folder.root, folder.relativeDir)));
      return 0;
    }
    default:
      throw new UsageError(`Unknown command "${command}".`);
  }
}
var UsageError = class extends Error {
};
function openMap(explicit) {
  if (explicit) return MapFolder.open(resolve2(explicit));
  const found = MapFolder.find(process.cwd());
  if (!found) throw new UsageError(`No map found from ${process.cwd()}. Run "mfmap init <folder>" first, or pass --map.`);
  return found;
}
async function init2(folderName, rootOption, addPointer) {
  if (!folderName) throw new UsageError('init needs the name of the folder to hold the map, e.g. "mfmap init codebase-map".');
  const root = resolve2(rootOption ?? process.cwd());
  const dir = isAbsolute(folderName) ? folderName : resolve2(root, folderName);
  if (!dir.startsWith(root)) throw new UsageError(`The map folder must be inside the project root (${root}).`);
  if (existsSync6(dir) && !existsSync6(resolve2(dir, CONFIG_FILE)) && readdirSync3(dir).length > 0) {
    throw new UsageError(`${dir} already exists and is not an mfmap folder. Choose another name.`);
  }
  const folder = existsSync6(resolve2(dir, CONFIG_FILE)) ? MapFolder.open(dir) : MapFolder.create(dir, root);
  if (addPointer) console.log(describePointerResults(writeInstructionPointers(folder.root, folder.relativeDir)));
  printReport(await updateMap(folder));
  console.log(`Map entry point: ${resolve2(dir, "MAP.md")}`);
  return 0;
}
async function showGraph(folder, open) {
  await updateMap(folder);
  const page = folder.path(GRAPH_PAGE);
  console.log(page);
  if (open) openInBrowser(page);
  return 0;
}
function openInBrowser(path) {
  const [command, args2] = process.platform === "darwin" ? ["open", [path]] : process.platform === "win32" ? ["cmd", ["/c", "start", "", path]] : ["xdg-open", [path]];
  spawn(command, args2, { detached: true, stdio: "ignore" }).unref();
}
function watchMap(folder) {
  console.log(`Watching ${folder.root} (Ctrl+C to stop).`);
  return new Promise(() => {
    watchProject(
      folder,
      (report) => {
        if (report.added.length + report.changed.length + report.removed.length > 0) printReport(report);
      },
      (error) => console.error(`mfmap update failed: ${error.message}`)
    );
  });
}
function listPending(folder, asJson, limit) {
  const book = loadSummaryBook(folder);
  const pending = book.pending();
  const index = folder.readJson(INDEX_FILE);
  const entries = new Map(index.files.map((entry) => [entry.path, entry]));
  const files = (limit > 0 ? pending.files.slice(0, limit) : pending.files).map((item) => {
    const entry = entries.get(item.path);
    const symbols = entry.symbols.filter((s) => !s.container).map((s) => `${s.kind} ${s.name}`);
    return { ...item, type: entry.fileType ?? entry.category, lines: entry.lines, symbols: symbols.slice(0, 20) };
  });
  const dirs = limit > 0 ? pending.dirs.slice(0, limit) : pending.dirs;
  if (asJson) {
    console.log(JSON.stringify({ totalFiles: pending.files.length, totalDirs: pending.dirs.length, files, dirs }, null, 2));
    return 0;
  }
  console.log(`${pending.files.length} files and ${pending.dirs.length} directories need summaries.`);
  for (const file of files) console.log(`file  ${file.reason.padEnd(7)} ${file.path}  (${file.type}, ${file.lines} lines)`);
  for (const dir of dirs) console.log(`dir   ${dir.reason.padEnd(7)} ${dir.path}/`);
  return 0;
}
async function setSummaries(folder, inputPath) {
  const raw = inputPath ? readFileSync7(inputPath, "utf8") : await readStdin();
  let input;
  try {
    input = JSON.parse(raw);
  } catch (error) {
    throw new UsageError(`Summaries input is not valid JSON: ${error.message}`);
  }
  const index = folder.readJson(INDEX_FILE);
  if (!index) throw new UsageError('The map has not been built yet. Run "mfmap update" first.');
  const book = new SummaryBook(folder.readJson(SUMMARIES_FILE) ?? emptySummaries(), index);
  const unknown = book.apply(input);
  await writeMapOutputs(folder, index, book);
  const pending = book.pending();
  const recorded = Object.keys(input.files ?? {}).length + Object.keys(input.dirs ?? {}).length - unknown.length;
  console.log(`Recorded ${recorded} summaries. Still pending: ${pending.files.length} files, ${pending.dirs.length} directories.`);
  if (unknown.length > 0) console.log(`Not in the map (ignored): ${unknown.join(", ")}`);
  return 0;
}
function loadSummaryBook(folder) {
  const index = folder.readJson(INDEX_FILE);
  if (!index) throw new UsageError('The map has not been built yet. Run "mfmap update" first.');
  return new SummaryBook(folder.readJson(SUMMARIES_FILE) ?? emptySummaries(), index);
}
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}
function printReport(report) {
  const parts2 = [`${report.fileCount} files mapped`];
  if (report.added.length) parts2.push(`${report.added.length} added`);
  if (report.changed.length) parts2.push(`${report.changed.length} changed`);
  if (report.removed.length) parts2.push(`${report.removed.length} removed`);
  console.log(`${parts2.join(", ")}. ${report.written.length} map files rewritten.`);
  if (report.pendingFileSummaries + report.pendingDirSummaries > 0) {
    const files = plural(report.pendingFileSummaries, "file");
    const dirs = plural(report.pendingDirSummaries, "directory", "directories");
    console.log(`Summaries pending: ${files}, ${dirs} ("mfmap summaries pending").`);
  }
}
main(process.argv.slice(2)).then(
  (code2) => {
    process.exitCode = code2;
  },
  (error) => {
    console.error(error instanceof UsageError ? error.message : `mfmap: ${error.stack ?? error.message}`);
    process.exitCode = error instanceof UsageError ? 2 : 1;
  }
);
