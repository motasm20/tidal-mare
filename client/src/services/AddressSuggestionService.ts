export interface AddressSuggestion {
    id: string; // unique ID for keying
    displayLabel: string; // e.g. "Willem de Rijkelaan 19, 5616 HX Eindhoven"
    street: string;
    houseNumber: string;
    postcode: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

interface PdokResponse {
    response: {
        docs: PdokDoc[];
    };
}

interface PdokDoc {
    id: string;
    weergavenaam: string;
    straatnaam: string;
    huisnummer: string;
    postcode: string;
    woonplaatsnaam: string;
    centroide_ll: string; // WKT format: "POINT(lon lat)"
}

export class AddressSuggestionService {
    private readonly API_URL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free';

    async search(query: string): Promise<AddressSuggestion[]> {
        if (!query || query.length < 2) return [];

        try {
            // Using 'free' endpoint for flexibility. 
            // fq=type:adres limits to specific addresses.
            // fl limits fields to what we need.
            const params = new URLSearchParams({
                q: `${query} and type:adres`,
                rows: '5',
                fl: 'id,weergavenaam,straatnaam,huisnummer,postcode,woonplaatsnaam,centroide_ll'
            });

            const response = await fetch(`${this.API_URL}?${params.toString()}`);
            if (!response.ok) return [];

            const data: PdokResponse = await response.json();

            return data.response.docs.map(doc => {
                const { lat, lon } = this.parseWktPoint(doc.centroide_ll);
                return {
                    id: doc.id,
                    displayLabel: doc.weergavenaam,
                    street: doc.straatnaam,
                    houseNumber: doc.huisnummer,
                    postcode: doc.postcode,
                    city: doc.woonplaatsnaam,
                    country: 'Nederland',
                    latitude: lat,
                    longitude: lon
                };
            });
        } catch (error) {
            console.error('PDOK API Error:', error);
            return [];
        }
    }

    private parseWktPoint(wkt: string): { lat: number, lon: number } {
        try {
            // Format: "POINT(5.478 51.439)" -> POINT(lon lat)
            const matches = wkt.match(/POINT\(([\d.]+) ([\d.]+)\)/);
            if (matches && matches.length === 3) {
                return {
                    lon: parseFloat(matches[1]),
                    lat: parseFloat(matches[2])
                };
            }
            return { lat: 0, lon: 0 };
        } catch (e) {
            return { lat: 0, lon: 0 };
        }
    }
}

export const addressSuggestionService = new AddressSuggestionService();
