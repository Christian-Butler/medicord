import { Colors, Sizes } from '@/constants/theme';
import { AppleMaps } from 'expo-maps';

type MapProps = {
    longitude?: number | null;
    latitude?: number | null;
    title?: string;
};

export default function Map({ longitude, latitude, title }: MapProps) {
    // Doctors without coordinates in the database get no map rather than a broken one.
    if (longitude == null || latitude == null) return null;

    const coordinates = { latitude, longitude };

    return (
        <AppleMaps.View
            // Inside a ScrollView, flex: 1 has no height to fill, so the map needs a fixed height.
            style={{ height: 220, borderRadius: Sizes.p3, marginBottom: Sizes.p3, overflow: 'hidden' }}
            cameraPosition={{ coordinates, zoom: 15 }}
            markers={[{ coordinates, title, tintColor: Colors.secondary }]}
        />
    );
}