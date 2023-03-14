function main(){
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Kaleidoscope {
        constructor(red, green, blue, index) {
          this.red = red;
          this.green = green;
          this.blue = blue;
          this.index = index;
          this.height = 0;
          this.smoothedMicInput = 0;
        }       
        update(micInput) {
            const smoothingFactor = 0.1;
            this.smoothedMicInput = smoothingFactor * micInput + (1 - smoothingFactor) * this.smoothedMicInput;
            this.height = this.smoothedMicInput * 32000;
            this.width = this.smoothedMicInput * 32000;
            this.red = this.smoothedMicInput * 255;
            this.green = Math.random() * 255;
            this.blue = Math.random() * 255;
          }
        draw(context){
            context.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
            context.save();
            context.translate(canvas.width/2, canvas.height/2);
            context.rotate(this.index * 0.8)
        
            for (let i = 0; i < 4; i++) {
                let angle1 = Math.random() * Math.PI * 2;
                let angle2 = Math.random() * Math.PI * 2;
                let x1 = Math.cos(angle1) * this.height;
                let y1 = Math.sin(angle1) * this.height;
                let x2 = Math.cos(angle2) * this.height;
                let y2 = Math.sin(angle2) * this.height;
                let minRadius = 16; // Minimum radius size
                let maxRadius = 128; // Maximum radius size
                let radius1 = Math.random() * (maxRadius - minRadius) + minRadius;
                let radius2 = Math.random() * (maxRadius - minRadius) + minRadius;
                context.beginPath();
                context.arc(x1, y1, radius1, 0, Math.PI * 2);
                context.fill();
                context.beginPath();
                context.arc(x2, y2, radius2, 0, Math.PI * 2);
                context.fill();
                context.scale(-1, 1);
                context.arc(-x2, y2, radius2, 0, Math.PI * 2);
                context.fill();
                context.scale(-1, 1);
            }
        
            context.restore();
        }
    }
    
    
    const microphone = new Microphone();
    let kaleidoscopes = [];
    let kaleidoscopeWidth = canvas.width/64;
    function createKaleidoscopes(){
        for (let i = 0; i < 256; i++){
            let color = 'hsl(60%, 10%, 50%)';
            kaleidoscopes.push(new Kaleidoscope(color, i));
        }
    }
    createKaleidoscopes();
    console.log(kaleidoscopes)

    function animate(){
        if (microphone.initialized){
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const samples = microphone.getSamples();
            kaleidoscopes.forEach(function(kaleidoscope, i){
                setTimeout(function(){
                    kaleidoscope.update(samples[i]);
                    kaleidoscope.draw(ctx);
                }, Math.random()*200);
            });
        }
        requestAnimationFrame(animate);
    }
    
    setTimeout(animate, 24);
    animate();

}
