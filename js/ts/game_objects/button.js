export default class Button {
    constructor(text, pos, size, font, stroke, strokeWeight, fill, textColor) {
        this.text = text;
        this.pos = pos;
        this.size = size;
        this.font = font;
        if (typeof stroke === "undefined")
            this.stroke = color(0);
        else
            this.stroke = stroke;
        if (typeof strokeWeight === "undefined")
            this.strokeWeight = 0.01;
        else
            this.strokeWeight = strokeWeight;
        if (typeof fill === "undefined")
            this.fill = color(200);
        else
            this.fill = fill;
        if (typeof textColor === "undefined")
            this.textColor = color(0);
        else
            this.textColor = textColor;
    }
    isHovered(mousePoint) {
        let xInBounds = abs(this.pos.x - mousePoint.x) <= this.size.x / 2;
        let yInBounds = abs(this.pos.y - mousePoint.y) <= this.size.y / 2;
        return xInBounds && yInBounds;
    }
    draw(bounds, opacity = 1) {
        let onScreenPosition = bounds.getScaledPoint(this.pos);
        let onScreenSize = bounds.getScaledSize(this.size);
        let onScreenOffset = onScreenSize.copy().div(2);
        let displayStrokeWeight = bounds.getScaledNumber(this.strokeWeight);
        noStroke();
        rectMode(CENTER);
        // Draw fill
        let transpFill = Object.create(this.fill);
        transpFill.setAlpha(0);
        fill(lerpColor(transpFill, this.fill, opacity));
        rect(onScreenPosition.x, onScreenPosition.y, onScreenSize.x - displayStrokeWeight, onScreenSize.y - displayStrokeWeight);
        // Draw stroke
        let transpStroke = Object.create(this.stroke);
        transpStroke.setAlpha(0);
        fill(lerpColor(transpStroke, this.stroke, opacity));
        rect(onScreenPosition.x, onScreenPosition.y - onScreenOffset.y, onScreenSize.x - displayStrokeWeight * 3, displayStrokeWeight);
        rect(onScreenPosition.x, onScreenPosition.y + onScreenOffset.y, onScreenSize.x - displayStrokeWeight * 3, displayStrokeWeight);
        rect(onScreenPosition.x - onScreenOffset.x, onScreenPosition.y, displayStrokeWeight, onScreenSize.y - displayStrokeWeight * 3);
        rect(onScreenPosition.x + onScreenOffset.x, onScreenPosition.y, displayStrokeWeight, onScreenSize.y - displayStrokeWeight * 3);
        let squareOffset = createVector(onScreenOffset.x - displayStrokeWeight, onScreenOffset.y - displayStrokeWeight);
        rect(onScreenPosition.x - squareOffset.x, onScreenPosition.y - squareOffset.y, displayStrokeWeight, displayStrokeWeight);
        rect(onScreenPosition.x - squareOffset.x, onScreenPosition.y + squareOffset.y, displayStrokeWeight, displayStrokeWeight);
        rect(onScreenPosition.x + squareOffset.x, onScreenPosition.y - squareOffset.y, displayStrokeWeight, displayStrokeWeight);
        rect(onScreenPosition.x + squareOffset.x, onScreenPosition.y + squareOffset.y, displayStrokeWeight, displayStrokeWeight);
        // Draw text
        let transpTextColor = Object.create(this.textColor);
        transpTextColor.setAlpha(0);
        fill(lerpColor(transpTextColor, this.textColor, opacity));
        let buttonDefaultSize = onScreenOffset.y;
        let defaultSizeRect = this.font.textBounds(this.text, 0, 0, buttonDefaultSize);
        let buttonTextSize = Math.min(onScreenOffset.y, buttonDefaultSize * onScreenSize.x / defaultSizeRect.w * 7 / 8);
        textAlign(CENTER, CENTER);
        textFont(this.font);
        textSize(buttonTextSize);
        text(this.text, onScreenPosition.x, onScreenPosition.y);
    }
}
