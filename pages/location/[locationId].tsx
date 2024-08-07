import LocationDetail from "@/components/location-details";
import dbConnect from "@/middleware/db-connect";
import { LocationType } from "@/mongoose/locations/schema";
import { findLocationsById } from "@/mongoose/locations/services";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage, PreviewData } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

const Location: NextPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    let location: LocationType = JSON.parse(props.data?.location);
    let title = `The Food Finder - Details for ${location?.name}`;
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={`The Food Finder.
    Details for ${location?.name}`}
                />
            </Head>
            <h1>{`${location?.name}`}</h1>
            <LocationDetail location={location} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
    let locations: LocationType[] | [];
    let { locationId } = context.query;
    try {
        await dbConnect();
        locations = await findLocationsById([locationId as string]);
        if (!locations.length) {
            throw new Error(`Locations ${locationId} not found`);
        }
    } catch (err: any) {
        return {
            notFound: true,
        };
    }
    return {
        props: { data: { location: JSON.stringify(locations.pop()) } },
    };
};

export default Location;