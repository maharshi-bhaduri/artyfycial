import ArtFeed from "../components/ArtFeed";
import ImageUpload from "../components/ImageUpload";

export default function Discover() {

    return (
        <div className="w-full h-full flex-col justify-center items-center">
            Discover artwork here
            <ImageUpload />
            <ArtFeed />
        </div>
    );
}
