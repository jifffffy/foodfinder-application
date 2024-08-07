import LocationsList from "@/components/locations-list";
import dbConnect from "@/middleware/db-connect";
import { LocationType } from "@/mongoose/locations/schema";
import { findAllLocations } from "@/mongoose/locations/services";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";


const Home: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const locations: LocationType[] = JSON.parse(props.data?.locations);
  let title = `The Food Finder - Home`;
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="The Food Finder - Home" />
      </Head>
      <h1>Welcome to the Food Finder!</h1>
      <LocationsList locations={locations} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let locations: LocationType[] | [];
  try {
    await dbConnect();
    locations = await findAllLocations();
  } catch (err: any) {
    return { notFound: true };
  }

  return {
    props: {
      data: { locations: JSON.stringify(locations) },
    },
  };
};

export default Home;