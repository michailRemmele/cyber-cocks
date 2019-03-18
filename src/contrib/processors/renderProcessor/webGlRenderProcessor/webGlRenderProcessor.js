import IOC from 'engine/ioc/ioc';
import Rectangle from './geometry/shapes/rectangle';
import * as global from 'engine/consts/global';

import ShaderBuilder from './shaderBuilder/shaderBuilder';
import webglUtils from './vendor/webglUtils';

const RENDERABLE_COMPONENT_KEY_NAME = 'renderable';
const RENDER_COMPONENTS_NUMBER = 2;
const RENDER_SCALE = 5;
const DRAW_OFFSET = 0;
const DRAW_COUNT = 6;

class WebGlRenderProcessor {
  constructor(window, textureAtlas, textureAtlasDescriptor) {
    this.textureAtlas = textureAtlas;
    this.textureAtlasSize = {
      width: this.textureAtlas.width,
      height: this.textureAtlas.height,
    };
    this.textureAtlasDescriptor = textureAtlasDescriptor;

    this.canvas = window;

    this.gl = this._initGraphicContext();
    this._initScreen();
    this.program = this._initShaders();
    this._initProgramInfo();
    this._initTextures();
  }

  _initGraphicContext() {
    let graphicContext = null;

    try {
      graphicContext =
        this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    } catch (e) {
      throw new Error('Unable to get graphic context.');
    }

    if (!graphicContext) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    return graphicContext;
  }

  _initScreen() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  _initShaders() {
    const shaderBuilder = new ShaderBuilder(this.gl);

    const vertexShader = shaderBuilder.create(shaderBuilder.VERTEX_SHADER);
    const fragmentShader = shaderBuilder.create(shaderBuilder.FRAGMENT_SHADER);

    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);

    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program.');
    }

    return shaderProgram;
  }

  _initProgramInfo() {
    this.gl.useProgram(this.program);

    this.programInfo = {
      attribs: {
        setters: webglUtils.createAttributeSetters(this.gl, this.program),
      },
      uniforms: {
        setters: webglUtils.createUniformSetters(this.gl, this.program),
      },
    };
  }

  _initTextures() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureAtlas
    );
  }

  process() {
    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    const currentScene = sceneProvider.getCurrentScene();

    webglUtils.resizeCanvasToDisplaySize(this.canvas, window.devicePixelRatio);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    currentScene.forEachPlacedGameObject((gameObject, x, y) => {
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_KEY_NAME);
      const texture = this.textureAtlasDescriptor[renderable.src];

      const attribs = {
        position: {
          data: new Rectangle(x, y, renderable.width, renderable.height).toArray(),
          numComponents: RENDER_COMPONENTS_NUMBER,
        },
        texCoord: {
          data: new Rectangle(texture.x, texture.y, texture.width, texture.height).toArray(),
          numComponents: RENDER_COMPONENTS_NUMBER,
        },
      };
      const bufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, attribs);

      webglUtils.setBuffersAndAttributes(this.gl, this.programInfo.attribs.setters, bufferInfo);

      const uniforms = {
        u_resolution: [ this.gl.canvas.width, this.gl.canvas.height ],
        u_scale: [ RENDER_SCALE, RENDER_SCALE ],
        u_textureAtlasSize: [ this.textureAtlasSize.width, this.textureAtlasSize.height ],
      };
      webglUtils.setUniforms(this.programInfo.uniforms.setters, uniforms);

      this.gl.drawArrays(this.gl.TRIANGLES, DRAW_OFFSET, DRAW_COUNT);
    });
  }
}

export default WebGlRenderProcessor;