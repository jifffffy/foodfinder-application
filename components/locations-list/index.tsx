import { LocationType } from "@/mongoose/locations/schema";
import LocationsListItem from "../locations-list-item";
import styles from "./index.module.css";

interface PropsInterface {
    locations: LocationType[];
}

const LocationsList = (props: PropsInterface): JSX.Element => {
    return (
        <ul className={styles.root}>
            {props.locations.map((location) => {
                return (
                    <LocationsListItem
                        location={location}
                        key={location.location_id}
                    />
                );
            })}
        </ul>
    );
}

export default LocationsList;