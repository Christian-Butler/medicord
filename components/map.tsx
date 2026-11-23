import { useImage } from 'expo-image';
import { AppleMaps } from 'expo-maps';

export default function Map({ longitude, latitude }) {

    const icon = useImage('https://example.com/marker.svg');

    return (
        <AppleMaps.View
            style={{ flex: 1 }}
            annotations={[
                {
                    coordinates: { latitude, longitude },
                    icon: icon ?? undefined,
                },
            ]}
        />
    );
}