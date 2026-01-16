class PCMPlayerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = new Float32Array(0);

        // this.port.onmessage = (event) => {
        //     if (event.data.type === "chunk") {
        //         const newData = event.data.samples;
        //         // Concatène au buffer existant
        //         const tmp = new Float32Array(this.buffer.length + newData.length);
        //         tmp.set(this.buffer, 0);
        //         tmp.set(newData, this.buffer.length);
        //         this.buffer = tmp;
        //     }
        // };

        this.port.onmessage = (event) => {
            if (event.data.type === "chunk") {
                const newData = event.data.samples;
                const tmp = new Float32Array(this.buffer.length + newData.length);
                tmp.set(this.buffer, 0);
                tmp.set(newData, this.buffer.length);
                this.buffer = tmp;
            } else if (event.data.type === "clear") {
                this.buffer = new Float32Array(0);
            }
        };

    }

    process(inputs, outputs) {
        const output = outputs[0];
        const channel = output[0];

        // const MAX_BUFFER = 24000 * 2; // 2 sec max de tampon

        // if (this.buffer.length > MAX_BUFFER) {
        //     // On garde les derniers 2 sec et on jette l’ancien
        //     this.buffer = this.buffer.subarray(this.buffer.length - MAX_BUFFER);
        // }

        if (this.buffer.length >= channel.length) {
            // Copier exactement channel.length échantillons
            channel.set(this.buffer.subarray(0, channel.length));

            // Raccourcir le buffer
            this.buffer = this.buffer.subarray(channel.length);
        } else {
            // Pas assez de samples → silence
            // channel.fill(0);
        }

        return true;
    }


}

registerProcessor("custom-pcm-processor", PCMPlayerProcessor);
