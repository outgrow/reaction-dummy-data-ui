import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { useApolloClient } from "@apollo/react-hooks";
import { Card, CardActions, CardHeader, CardContent, Grid } from "@material-ui/core";
import Button from "@reactioncommerce/catalyst/Button";
import Toast from "@reactioncommerce/catalyst/Toast"
import { Components } from "@reactioncommerce/reaction-components";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import decodeOpaqueIdForNamespace from "/imports/utils/decodeOpaqueIdForNamespace.js";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar/PrimaryAppBar";
import { loadOrders, loadProductImages, loadProductsAndTags, removeAllData } from "../mutations";

const RightAlignedGrid = styled(Grid)`
  text-align: right;
`;

function DummyData() {
  const [desiredProductCount, setDesiredProductCount] = useState(0);
  const [desiredTagCount, setDesiredTagCount] = useState(0);
  const [desiredOrderCount, setDesiredOrderCount] = useState(0);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("info");
  const [currentShopId, setCurrentShopId] = useState("");

  const apolloClient = useApolloClient();

  const [currentOpaqueShopId] = useCurrentShopId();

  console.log(currentOpaqueShopId);

  useEffect(() => {
    async function decodeAndSetShopId(shopId) {
      const decodedShopId = await decodeOpaqueIdForNamespace("reaction/shop", shopId);

      if (decodedShopId !== currentOpaqueShopId) {
        setCurrentShopId(decodedShopId);
      }
    }

    if (currentOpaqueShopId.length > 0) {
      decodeAndSetShopId(currentOpaqueShopId);
    }
  }, [currentOpaqueShopId]);

  const handleGenerateProductsAndTags = async () => {
    try {
      const {
        data: {
          loadProductsAndTags: payload
        }
      } = await apolloClient.mutate({
        mutation: loadProductsAndTags,
        variables: {
          input: {
            shopId: currentShopId,
            desiredProductCount: parseInt(desiredProductCount),
            desiredTagCount: parseInt(desiredTagCount)
          }
        }
      });

      setIsToastOpen(true);
      setToastMessage(`Successfully created ${payload.productsCreated} product${payload.productsCreated > 1 ? "s" : ""} and ${payload.tagsCreated} tag${payload.tagsCreated > 1 ? "s" : ""}.`);
      setToastVariant("success");
    } catch (err) {
      setIsToastOpen(true);
      setToastMessage(err.message);
      setToastVariant("error");
    }
  };

  const handleGenerateOrders = async () => {
    try {
      const {
        data: {
          loadOrders: payload
        }
      } = await apolloClient.mutate({
        mutation: loadOrders,
        variables: {
          input: {
            shopId: currentShopId,
            desiredOrderCount: parseInt(desiredOrderCount)
          }
        }
      });

      setIsToastOpen(true);
      setToastMessage(`Successfully created ${payload.ordersCreated} order${payload.productsCreated > 1 ? "s" : ""}.`);
      setToastVariant("success");
    } catch (err) {
      setIsToastOpen(true);
      setToastMessage(err.message);
      setToastVariant("error");
    }
  };

  const handleGenerateProductImages = async () => {
    try {
      const {
        data: {
          loadProductImages: payload
        }
      } = await apolloClient.mutate({
        mutation: loadProductImages,
        variables: {
          input: {
            shopId: currentShopId
          }
        }
      });

      setIsToastOpen(true);
      setToastMessage(payload.wasDataLoaded ? "Successfully inserted product images." : "Couldn't insert product images.");
      setToastVariant(payload.wasDataLoaded ? "success" : "error");
    } catch (err) {
      setIsToastOpen(true);
      setToastMessage(err.message);
      setToastVariant("error");
    }
  };

  const handleArmageddon = async () => {
    try {
      const {
        data: {
          removeAllData: payload
        }
      } = await apolloClient.mutate({
        mutation: removeAllData,
        variables: {
          input: {
            shopId: currentShopId
          }
        }
      });

      setIsToastOpen(true);
      setToastMessage(payload.wasDataRemoved ? "Successfully removed data." : "Couldn't remove any data.");
      setToastVariant(payload.wasDataRemoved ? "success" : "error");
    } catch (err) {
      setIsToastOpen(true);
      setToastMessage(err.message);
      setToastVariant("error");
    }
  };

  return (
    <Fragment>
      <PrimaryAppBar title="Dummy Data" />

      <Grid container spacing={1}>
        <Grid item sm={6}>
          <Card>
            <CardHeader title="Products and Tags" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item sm={6}>
                  <Components.TextField
                    label="Number of products"
                    type="number"
                    minValue={0}
                    value={desiredProductCount}
                    onChange={(event) => setDesiredProductCount(event.target.value)}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Components.TextField
                    label="Number of tags"
                    type="number"
                    minValue={0}
                    value={desiredTagCount}
                    onChange={(event) => setDesiredTagCount(event.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container alignItems="center" justify="flex-end">
                <RightAlignedGrid item xs={12}>
                  <Button color="primary" variant="outlined" onClick={handleGenerateProductsAndTags}>Generate Products and Tags</Button>
                </RightAlignedGrid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>

        <Grid item sm={6}>
          <Card>
            <CardHeader title="Orders" />
            <CardContent>
              <Components.TextField
                label="Number of orders"
                type="number"
                minValue={0}
                value={desiredOrderCount}
                onChange={(event) => setDesiredOrderCount(event.target.value)}
              />
            </CardContent>
            <CardActions>
              <Grid container alignItems="center" justify="flex-end">
                <RightAlignedGrid item xs={12}>
                  <Button color="primary" variant="outlined" onClick={handleGenerateOrders}>Generate Orders</Button>
                </RightAlignedGrid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item sm={6}>
          <Card>
            <CardHeader title="Product Images" />
            <CardContent>
              <p>We hope you like dogs.</p>
            </CardContent>
            <CardActions>
              <Grid container alignItems="center" justify="flex-end">
                <RightAlignedGrid item xs={12}>
                  <Button color="primary" variant="outlined" onClick={handleGenerateProductImages}>Generate Product Images</Button>
                </RightAlignedGrid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>

        <Grid item sm={6}>
          <Card>
            <CardHeader title="Armageddon" />
            <CardContent>
              <p>Beware: this will erase the content of the Products, Catalog, Tags and Orders collections for shop {currentShopId}.</p>
            </CardContent>
            <CardActions>
              <Grid container alignItems="center" justify="flex-end">
                <RightAlignedGrid item xs={12}>
                  <Button color="error" variant="contained" onClick={handleArmageddon}>Delete All Data</Button>
                </RightAlignedGrid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>

        <Grid item sm={12}>
          <Card>
            <CardHeader title="Example" />
            <CardContent>
              <p>The numbers you input here indicate how many items you want in the database in total. The plugin will compensate to reach your desired count. For example, if you already have 20 products and want to add 10 more, use "30" as a value in "Number of products."</p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item sm={12}>
          <Card>
            <CardHeader title="Help" />
            <CardContent>
              <img alt="out:grow logo" width="200px" src="data:image/svg+xml;utf8,%3Csvg width='704' height='314' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M61.37 195.25c-27.15 0-45-19.5-45-43.65 0-24 17.85-43.8 45-43.8 27.3 0 45.15 19.8 45.15 43.8 0 24.15-17.85 43.65-45.15 43.65zm0-24.75c10.5 0 18.75-8.25 18.75-19.05 0-10.5-8.25-18.75-18.75-18.75-10.35 0-18.6 8.25-18.6 18.75 0 10.8 8.25 19.05 18.6 19.05zm93.133 24.6c-24.45 0-39.75-13.5-39.75-38.25V110.2h26.55v46.95c0 7.95 4.95 13.8 13.2 13.8 8.4 0 13.35-5.85 13.35-13.8V110.2h26.55v46.65c0 24.75-15.3 38.25-39.9 38.25zm109.332-27.9l7.05 21.15c-6.9 4.05-17.25 6.75-26.4 6.75-19.8 0-30.75-11.1-30.75-34.2v-28.8h-12.6v-21.9h12.9V80.8h26.25v29.4h25.95v21.9h-25.95v25.65c0 9.3 3.75 13.2 10.5 13.2 5.25 0 9.3-1.8 13.05-3.75zm26.083-24.45c-8.1 0-14.7-6.15-14.7-14.4 0-7.95 6.6-14.1 14.7-14.1 7.65 0 14.1 6.15 14.1 14.1 0 8.25-6.45 14.4-14.1 14.4zm0 52.65c-8.1 0-14.7-6.15-14.7-14.4 0-7.95 6.6-14.1 14.7-14.1 7.65 0 14.1 6.15 14.1 14.1 0 8.25-6.45 14.4-14.1 14.4zm87.882-85.2h23.85v74.85c0 26.85-20.55 43.05-47.1 43.05-14.85 0-29.25-5.1-39.15-12.45l9.6-19.35c7.35 4.8 17.4 9.45 28.5 9.45 15.6 0 22.95-8.7 22.95-19.05v-1.8c-5.25 4.95-12.75 8.25-23.1 8.25-24.9 0-40.95-17.7-40.95-42.3 0-25.8 18.45-42.75 42.15-42.75 10.05 0 17.7 3.75 23.25 9v-6.9zm-19.95 60.15c10.8 0 18.75-8.25 18.75-19.2 0-10.8-7.95-18.75-18.75-18.75s-18.75 7.8-18.75 18.75c0 11.1 7.95 19.2 18.75 19.2zM414.682 193v-82.8h25.35v10.2c5.4-8.55 13.5-12.45 22.05-12.45 3.15 0 7.05.75 10.35 2.25l-2.1 25.2c-3.6-1.2-7.35-1.95-10.95-1.95-10.35 0-18.3 6-18.3 23.85V193h-26.4zm102.283 2.25c-27.15 0-45-19.5-45-43.65 0-24 17.85-43.8 45-43.8 27.3 0 45.15 19.8 45.15 43.8 0 24.15-17.85 43.65-45.15 43.65zm0-24.75c10.5 0 18.75-8.25 18.75-19.05 0-10.5-8.25-18.75-18.75-18.75-10.35 0-18.6 8.25-18.6 18.75 0 10.8 8.25 19.05 18.6 19.05zm71.682 22.35l-28.2-82.65h27.9l14.25 48.15 15.75-48.15h18.6l16.05 48.15 14.1-48.15h27.9l-28.2 82.65h-23.55l-15.6-43.95-15.45 43.95h-23.55z' fill='%231D1D1D' fill-rule='nonzero'/%3E%3C/svg%3E" />

              <p>This open-source plugin was built and is maintained by <a href="https://outgrow.io">out:grow</a>.</p>
              <p>Need developer help with your Reaction Commerce project? Want someone to train your team to use Reaction at its fullest?</p>
              <p>Whether it's a chat-only support plan, a one-hour consultation to get you set up or helping your team ship a whole project from start to finish, you can't go wrong by reaching out to us:</p>

              <ul>
                <li><a href="tel:+12816884769">+1 (281) OUT-GROW</a></li>
                <li><a href="mailto:contact@outgrow.io">contact@outgrow.io</a></li>
                <li><a href="https://outgrow.io">https://outgrow.io</a></li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Toast
        open={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        message={toastMessage}
        variant={toastVariant}
      />
    </Fragment>
  );
}

export default DummyData;
