this.demo = this.demo || {};

(function()
{
    /**
     * 游戏主类
     * main class
     * @class
     */
    demo.Main = Class
    (
        /** @lends demo.Main.prototype */
        {

            STATIC :
            /** @lends demo.Main */
            {
                /**
                 * 舞台
                 */
                stage : null,
                /**
                 * 场景
                 */
                scene : null,

                /**
                 * 游戏资源
                 */
                assets : null
            },

            /**
		 * 预加载资源
             * list of preloading assets
             * @type {Object}
             * @private
             */
            _manifest : null,

            /**
		 * 已加载资源数量
             * the amount of loaded assets
             * @type {number}
             * @private
             */
            _loaded : 0,


            /**
             * 初始化
		 * initializing
             */
            initialize : function(canvasId, width, height)
            {

                //创建舞台
		        //build stage
                demo.Main.stage = new ss2d.Stage2D(canvasId, width, height);
				//加载文本
                this.txt = new ss2d.TextField(256,32);
                this.txt.setFontSize(16);
                this.txt.setColor(0xff,0xff,0xff);
                this.txt.setText("进度");
                this.txt.setX(120);
                this.txt.setY(20);
                ss2d.stage.addChild(this.txt);
                //预加载资源列表
		        //list of preloading assets
                this._manifest =
                [
                    //{src:"images/logo.png", id:"logo"}
                    {src:"images/gongji.png", id:"animationpng"},
                    {src:"images/gongji.xml", id:"animationxml"}
                ];

                //把事件处理函数存放在demo中
                //add event handler to the game
                demo["handleFileLoad"] = this._handleFileLoad.bind(this);//加载完成回调函数_handleFileLoad()在每个文件加载完成时调用一次并进行计数，如果计数器达到预加载资源总数，说明所有资源以及记载完成，清除对应的事件监听器和资源加载回调函数。
                demo["handleOverallProgress"] = this._handleOverallProgress.bind(this);//加载进度函数_handleOverallProgress()实时刷新资源的加载进度，并以文本的形式在屏幕上进行显示 by pcj

                //资源加载器
                //assets loader
                demo.Main.assets = new ss2d.LoadQueue(true);
                demo.Main.assets.on("fileload", demo["handleFileLoad"]);
                demo.Main.assets.on("progress", demo["handleOverallProgress"]);
                demo.Main.assets.loadManifest(this._manifest);
            },


            /**
             * 资源文件加载完毕事件处理器
		     * handler on file loaded
             * @param e
             * @private
             */
            _handleFileLoad : function(e)
            {
                this._loaded++;
                if (this._loaded == this._manifest.length)
                {
					ss2d.stage.removeChild( this.txt);
                    demo.Main.assets.removeEventListener("fileload", demo["handleFileLoad"]);
                    demo.Main.assets.removeEventListener("progress", demo["handleOverallProgress"]);
                    demo["handleFileLoad"] = null;
                    demo["handleOverallProgress"] = null;
                    this._init();
                }
            },

            /**
             * 资源文件加载进度事件处理器
             * progress bar handler
             * @param e
             * @private
             */
           _handleOverallProgress : function(e)
            {
                var str = String(demo.Main.assets.progress).slice(2,4);
                this.txt.setText("正在加载......" + str + "%");

            },

            /**
             * 摇杆逻辑
             */
            dx: 0,
            dy: 0,

            wx: 0,
            hy: 0,

            speed:  .7,
            frime: .8,
            mc:null,
            _init:function()
            {

                //是否根据浏览器动态大小修改舞台尺寸
                ss2d.stage.setAutoAdjustToBrowser(true);
                ss2d.stage.adjustToBrowser(ss2d.screenAdjust.Ratio);

                //显示FPS
                ss2d.stage.showStats(true);

                //创建纹理对象
		       //create texture
                //var texture=new ss2d.Texture(demo.Main.assets.getResult("logo"));
                var texture=new ss2d.Texture(demo.Main.assets.getResult("animationpng"),demo.Main.assets.getResult("animationxml"));
                //创建一个影片剪辑类
		       //create movie clip
                this.mc=new ss2d.MovieClip(texture);
                this.mc.setCenter(true);
                
                this.mc.setX(ss2d.Stage2D.stageWidth/2);
                this.mc.setY(ss2d.Stage2D.stageHeight/2);

                 //设置玻璃着色器
                //set shader as glass shader
                //this.mc.setShader(new ss2d.ShaderGlass());//玻璃效果，水波效果
                //this.mc.setShader(new ss2d.ShaderGray());//变灰
                //this.mc.setShader(new ss2d.ShaderMosaic());//马赛克效果

                //设置循环播放
                //set loop animation
                this.mc.loop(true);

                //设置动画播放
                //play animation
                this.mc.play();

                //设置FPS为60
                //set FPS 60
                this.mc.setAnimationSpeed(60);

                //添加到场景显示
		       //add movie clip to the stage
                ss2d.stage.addChild(this.mc);


                

            }

        }
    );
})();