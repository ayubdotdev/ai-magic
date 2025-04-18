
interface Image {
    base64: string;
}

interface Response {
    images: Image[];
    finish_reason: string;
    seed: number;
}