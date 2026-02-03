/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

export type SitemapQueryVariables = StorefrontAPI.Exact<{
  urlLimits?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SitemapQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'updatedAt' | 'handle' | 'onlineStoreUrl' | 'title'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
  };
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'updatedAt' | 'handle' | 'onlineStoreUrl'>
    >;
  };
  pages: {
    nodes: Array<
      Pick<StorefrontAPI.Page, 'updatedAt' | 'handle' | 'onlineStoreUrl'>
    >;
  };
};

export type FeaturedCollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type FeaturedCollectionQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FeaturedCollectionQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type RecommendedProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  images: {
    nodes: Array<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
  };
};

export type RecommendedProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        images: {
          nodes: Array<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        };
      }
    >;
  };
};

export type CustomerAddressUpdateMutationVariables = StorefrontAPI.Exact<{
  address: StorefrontAPI.MailingAddressInput;
  customerAccessToken: StorefrontAPI.Scalars['String'];
  id: StorefrontAPI.Scalars['ID'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerAddressUpdateMutation = {
  customerAddressUpdate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MailingAddress, 'id'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerAddressDeleteMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String'];
  id: StorefrontAPI.Scalars['ID'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerAddressDeleteMutation = {
  customerAddressDelete?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.CustomerAddressDeletePayload,
      'deletedCustomerAddressId'
    > & {
      customerUserErrors: Array<
        Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
      >;
    }
  >;
};

export type CustomerDefaultAddressUpdateMutationVariables =
  StorefrontAPI.Exact<{
    addressId: StorefrontAPI.Scalars['ID'];
    customerAccessToken: StorefrontAPI.Scalars['String'];
    country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
    language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  }>;

export type CustomerDefaultAddressUpdateMutation = {
  customerDefaultAddressUpdate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<{
      defaultAddress?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MailingAddress, 'id'>
      >;
    }>;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerAddressCreateMutationVariables = StorefrontAPI.Exact<{
  address: StorefrontAPI.MailingAddressInput;
  customerAccessToken: StorefrontAPI.Scalars['String'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerAddressCreateMutation = {
  customerAddressCreate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MailingAddress, 'id'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type OrderMoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type AddressFullFragment = Pick<
  StorefrontAPI.MailingAddress,
  | 'address1'
  | 'address2'
  | 'city'
  | 'company'
  | 'country'
  | 'countryCodeV2'
  | 'firstName'
  | 'formatted'
  | 'id'
  | 'lastName'
  | 'name'
  | 'phone'
  | 'province'
  | 'provinceCode'
  | 'zip'
>;

export type DiscountApplicationFragment = {
  value:
    | ({__typename: 'MoneyV2'} & Pick<
        StorefrontAPI.MoneyV2,
        'amount' | 'currencyCode'
      >)
    | ({__typename: 'PricingPercentageValue'} & Pick<
        StorefrontAPI.PricingPercentageValue,
        'percentage'
      >);
};

export type OrderLineProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'sku' | 'title'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'height' | 'url' | 'id' | 'width'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'handle'>;
};

export type OrderLineItemFullFragment = Pick<
  StorefrontAPI.OrderLineItem,
  'title' | 'quantity'
> & {
  discountAllocations: Array<{
    allocatedAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    discountApplication: {
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            StorefrontAPI.PricingPercentageValue,
            'percentage'
          >);
    };
  }>;
  originalTotalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  discountedTotalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  variant?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.ProductVariant, 'id' | 'sku' | 'title'> & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'altText' | 'height' | 'url' | 'id' | 'width'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'handle'>;
    }
  >;
};

export type OrderFragment = Pick<
  StorefrontAPI.Order,
  | 'id'
  | 'name'
  | 'orderNumber'
  | 'statusUrl'
  | 'processedAt'
  | 'fulfillmentStatus'
> & {
  totalTaxV2?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalPriceV2: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  subtotalPriceV2?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  shippingAddress?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.MailingAddress,
      | 'address1'
      | 'address2'
      | 'city'
      | 'company'
      | 'country'
      | 'countryCodeV2'
      | 'firstName'
      | 'formatted'
      | 'id'
      | 'lastName'
      | 'name'
      | 'phone'
      | 'province'
      | 'provinceCode'
      | 'zip'
    >
  >;
  discountApplications: {
    nodes: Array<{
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            StorefrontAPI.PricingPercentageValue,
            'percentage'
          >);
    }>;
  };
  lineItems: {
    nodes: Array<
      Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
        discountAllocations: Array<{
          allocatedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          discountApplication: {
            value:
              | ({__typename: 'MoneyV2'} & Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >)
              | ({__typename: 'PricingPercentageValue'} & Pick<
                  StorefrontAPI.PricingPercentageValue,
                  'percentage'
                >);
          };
        }>;
        originalTotalPrice: Pick<
          StorefrontAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        discountedTotalPrice: Pick<
          StorefrontAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        variant?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.ProductVariant, 'id' | 'sku' | 'title'> & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'altText' | 'height' | 'url' | 'id' | 'width'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<StorefrontAPI.Product, 'handle'>;
          }
        >;
      }
    >;
  };
};

export type OrderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  orderId: StorefrontAPI.Scalars['ID'];
}>;

export type OrderQuery = {
  order?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Order,
      | 'id'
      | 'name'
      | 'orderNumber'
      | 'statusUrl'
      | 'processedAt'
      | 'fulfillmentStatus'
    > & {
      totalTaxV2?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalPriceV2: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      subtotalPriceV2?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      shippingAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'address1'
          | 'address2'
          | 'city'
          | 'company'
          | 'country'
          | 'countryCodeV2'
          | 'firstName'
          | 'formatted'
          | 'id'
          | 'lastName'
          | 'name'
          | 'phone'
          | 'province'
          | 'provinceCode'
          | 'zip'
        >
      >;
      discountApplications: {
        nodes: Array<{
          value:
            | ({__typename: 'MoneyV2'} & Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >)
            | ({__typename: 'PricingPercentageValue'} & Pick<
                StorefrontAPI.PricingPercentageValue,
                'percentage'
              >);
        }>;
      };
      lineItems: {
        nodes: Array<
          Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
            discountAllocations: Array<{
              allocatedAmount: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              discountApplication: {
                value:
                  | ({__typename: 'MoneyV2'} & Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >)
                  | ({__typename: 'PricingPercentageValue'} & Pick<
                      StorefrontAPI.PricingPercentageValue,
                      'percentage'
                    >);
              };
            }>;
            originalTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            discountedTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            variant?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ProductVariant, 'id' | 'sku' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'url' | 'id' | 'width'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                product: Pick<StorefrontAPI.Product, 'handle'>;
              }
            >;
          }
        >;
      };
    }
  >;
};

export type OrderItemFragment = Pick<
  StorefrontAPI.Order,
  | 'financialStatus'
  | 'fulfillmentStatus'
  | 'id'
  | 'orderNumber'
  | 'customerUrl'
  | 'statusUrl'
  | 'processedAt'
> & {
  currentTotalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  lineItems: {
    nodes: Array<
      Pick<StorefrontAPI.OrderLineItem, 'title'> & {
        variant?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'height' | 'width'>
          >;
        }>;
      }
    >;
  };
};

export type CustomerOrdersFragment = Pick<
  StorefrontAPI.Customer,
  'numberOfOrders'
> & {
  orders: {
    nodes: Array<
      Pick<
        StorefrontAPI.Order,
        | 'financialStatus'
        | 'fulfillmentStatus'
        | 'id'
        | 'orderNumber'
        | 'customerUrl'
        | 'statusUrl'
        | 'processedAt'
      > & {
        currentTotalPrice: Pick<
          StorefrontAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        lineItems: {
          nodes: Array<
            Pick<StorefrontAPI.OrderLineItem, 'title'> & {
              variant?: StorefrontAPI.Maybe<{
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'height' | 'width'
                  >
                >;
              }>;
            }
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'endCursor'
    >;
  };
};

export type CustomerOrdersQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  customerAccessToken: StorefrontAPI.Scalars['String'];
  endCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  startCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
}>;

export type CustomerOrdersQuery = {
  customer?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Customer, 'numberOfOrders'> & {
      orders: {
        nodes: Array<
          Pick<
            StorefrontAPI.Order,
            | 'financialStatus'
            | 'fulfillmentStatus'
            | 'id'
            | 'orderNumber'
            | 'customerUrl'
            | 'statusUrl'
            | 'processedAt'
          > & {
            currentTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            lineItems: {
              nodes: Array<
                Pick<StorefrontAPI.OrderLineItem, 'title'> & {
                  variant?: StorefrontAPI.Maybe<{
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'url' | 'altText' | 'height' | 'width'
                      >
                    >;
                  }>;
                }
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor'
        >;
      };
    }
  >;
};

export type CustomerUpdateMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String'];
  customer: StorefrontAPI.CustomerUpdateInput;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerUpdateMutation = {
  customerUpdate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'acceptsMarketing' | 'email' | 'firstName' | 'id' | 'lastName' | 'phone'
      >
    >;
    customerAccessToken?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.CustomerAccessToken, 'accessToken' | 'expiresAt'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerFragment = Pick<
  StorefrontAPI.Customer,
  | 'acceptsMarketing'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'numberOfOrders'
  | 'phone'
> & {
  addresses: {
    nodes: Array<
      Pick<
        StorefrontAPI.MailingAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'country'
        | 'province'
        | 'city'
        | 'zip'
        | 'phone'
      >
    >;
  };
  defaultAddress?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.MailingAddress,
      | 'id'
      | 'formatted'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'address1'
      | 'address2'
      | 'country'
      | 'province'
      | 'city'
      | 'zip'
      | 'phone'
    >
  >;
};

export type AddressFragment = Pick<
  StorefrontAPI.MailingAddress,
  | 'id'
  | 'formatted'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'country'
  | 'province'
  | 'city'
  | 'zip'
  | 'phone'
>;

export type CustomerQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerQuery = {
  customer?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Customer,
      | 'acceptsMarketing'
      | 'email'
      | 'firstName'
      | 'lastName'
      | 'numberOfOrders'
      | 'phone'
    > & {
      addresses: {
        nodes: Array<
          Pick<
            StorefrontAPI.MailingAddress,
            | 'id'
            | 'formatted'
            | 'firstName'
            | 'lastName'
            | 'company'
            | 'address1'
            | 'address2'
            | 'country'
            | 'province'
            | 'city'
            | 'zip'
            | 'phone'
          >
        >;
      };
      defaultAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'id'
          | 'formatted'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'country'
          | 'province'
          | 'city'
          | 'zip'
          | 'phone'
        >
      >;
    }
  >;
};

export type CustomerActivateMutationVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID'];
  input: StorefrontAPI.CustomerActivateInput;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerActivateMutation = {
  customerActivate?: StorefrontAPI.Maybe<{
    customerAccessToken?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.CustomerAccessToken, 'accessToken' | 'expiresAt'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type LoginMutationVariables = StorefrontAPI.Exact<{
  input: StorefrontAPI.CustomerAccessTokenCreateInput;
}>;

export type LoginMutation = {
  customerAccessTokenCreate?: StorefrontAPI.Maybe<{
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
    customerAccessToken?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.CustomerAccessToken, 'accessToken' | 'expiresAt'>
    >;
  }>;
};

export type CustomerRecoverMutationVariables = StorefrontAPI.Exact<{
  email: StorefrontAPI.Scalars['String'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerRecoverMutation = {
  customerRecover?: StorefrontAPI.Maybe<{
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type CustomerCreateMutationVariables = StorefrontAPI.Exact<{
  input: StorefrontAPI.CustomerCreateInput;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerCreateMutation = {
  customerCreate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Customer, 'id'>>;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type RegisterLoginMutationVariables = StorefrontAPI.Exact<{
  input: StorefrontAPI.CustomerAccessTokenCreateInput;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RegisterLoginMutation = {
  customerAccessTokenCreate?: StorefrontAPI.Maybe<{
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
    customerAccessToken?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.CustomerAccessToken, 'accessToken' | 'expiresAt'>
    >;
  }>;
};

export type CustomerResetMutationVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID'];
  input: StorefrontAPI.CustomerResetInput;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CustomerResetMutation = {
  customerReset?: StorefrontAPI.Maybe<{
    customerAccessToken?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.CustomerAccessToken, 'accessToken' | 'expiresAt'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type PredictiveArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveCollectionFragment = {__typename: 'Collection'} & Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictivePageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'id' | 'title' | 'handle' | 'trackingParameters'
>;

export type PredictiveProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    variants: {
      nodes: Array<
        Pick<StorefrontAPI.ProductVariant, 'id'> & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        }
      >;
    };
  };

export type PredictiveQueryFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<
  StorefrontAPI.SearchQuerySuggestion,
  'text' | 'styledText' | 'trackingParameters'
>;

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  searchTerm: StorefrontAPI.Scalars['String'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              }
            >;
          };
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

export type QuickViewProductQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type QuickViewProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'handle' | 'descriptionHtml'
    > & {
      options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      priceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      images: {
        nodes: Array<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      };
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'title' | 'availableForSale'
          > & {
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          }
        >;
      };
    }
  >;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String'];
  blogHandle: StorefrontAPI.Scalars['String'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<{
    articleByHandle?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Article, 'title' | 'contentHtml' | 'publishedAt'> & {
        author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'description' | 'title'>
        >;
      }
    >;
  }>;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  blogHandle: StorefrontAPI.Scalars['String'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  startCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
  endCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
};

export type BlogsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  startCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
}>;

export type BlogsQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
      }
    >;
  };
};

export type MoneyProductItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type ProductItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {
    nodes: Array<{
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
    }>;
  };
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  startCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
  endCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductCollectionSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']>;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      products: {
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            variants: {
              nodes: Array<{
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              }>;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
        >;
      };
    }
  >;
};

export type CollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type StoreCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  startCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
}>;

export type StoreCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean'];
  refundPolicy: StorefrontAPI.Scalars['Boolean'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean'];
  termsOfService: StorefrontAPI.Scalars['Boolean'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'quantityAvailable' | 'sku' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  image?: StorefrontAPI.Maybe<
    {__typename: 'Image'} & Pick<
      StorefrontAPI.Image,
      'id' | 'url' | 'altText' | 'width' | 'height'
    >
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'vendor' | 'handle' | 'descriptionHtml' | 'description'
> & {
  options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
  selectedVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'quantityAvailable' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'quantityAvailable' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          {__typename: 'Image'} & Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }
    >;
  };
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'vendor' | 'handle' | 'descriptionHtml' | 'description'
    > & {
      options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'quantityAvailable' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'quantityAvailable' | 'sku' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              {__typename: 'Image'} & Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }
        >;
      };
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type ProductVariantsFragment = {
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'quantityAvailable' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          {__typename: 'Image'} & Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }
    >;
  };
};

export type ProductVariantsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String'];
}>;

export type ProductVariantsQuery = {
  product?: StorefrontAPI.Maybe<{
    variants: {
      nodes: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'quantityAvailable' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
    };
  }>;
};

export type SearchProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'handle' | 'id' | 'publishedAt' | 'title' | 'trackingParameters' | 'vendor'
> & {
    variants: {
      nodes: Array<
        Pick<StorefrontAPI.ProductVariant, 'id'> & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
        }
      >;
    };
  };

export type SearchPageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type SearchArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type SearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']>;
  query: StorefrontAPI.Scalars['String'];
  startCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.SearchSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']>;
}>;

export type SearchQuery = {
  products: {
    nodes: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'handle'
        | 'id'
        | 'publishedAt'
        | 'title'
        | 'trackingParameters'
        | 'vendor'
      > & {
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
              }
            >;
          };
        }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
  pages: {
    nodes: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  articles: {
    nodes: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
};

export type RouteContentQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RouteContentQuery = {
  route?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'type' | 'id'> & {
      title?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
      >;
      sections?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              heading?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              subheading?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              button_text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              button_link?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key'> & {
                  reference?: StorefrontAPI.Maybe<{
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'url' | 'width' | 'height'
                      >
                    >;
                  }>;
                }
              >;
              autoplay?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              autoplay_speed?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              slides?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      heading?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      subheading?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      button_text?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      button_link?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      image?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<{
                          image?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Image, 'url' | 'altText'>
                          >;
                        }>;
                      }>;
                    }
                  >;
                }>;
              }>;
              label?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              show_prices?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              products?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
                      variants: {
                        nodes: Array<{
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'altText' | 'width' | 'height' | 'url'
                            >
                          >;
                        }>;
                      };
                      priceRange: {
                        minVariantPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      };
                    }
                  >;
                }>;
              }>;
              columns?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              collections?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<
                      StorefrontAPI.Collection,
                      'id' | 'title' | 'handle' | 'description'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    }
                  >;
                }>;
              }>;
              content?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              link_text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              link_url?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              body?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              image_position?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              video_url?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              video_file?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  sources: Array<
                    Pick<StorefrontAPI.VideoSource, 'url' | 'mimeType'>
                  >;
                }>;
              }>;
              poster_image?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  image?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Image, 'url' | 'altText'>
                  >;
                }>;
              }>;
              loop?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              muted?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              testimonials?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      quote?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      author?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      role?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      rating?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      avatar?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<{
                          image?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Image, 'url' | 'altText'>
                          >;
                        }>;
                      }>;
                    }
                  >;
                }>;
              }>;
              grayscale?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              logos?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<{
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url' | 'altText'>
                    >;
                  }>;
                }>;
              }>;
              faqs?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      question?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      answer?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                    }
                  >;
                }>;
              }>;
              features?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      title?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      description?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      icon?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                      >;
                      icon_image?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<{
                          image?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Image, 'url' | 'altText'>
                          >;
                        }>;
                      }>;
                    }
                  >;
                }>;
              }>;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              background_color?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              text_color?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              end_date?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              expired_text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              placeholder?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              social_text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
              >;
              twitter_url?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              instagram_url?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              facebook_url?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              youtube_url?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              pinterest_url?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
              tiktok_url?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
            }
          >;
        }>;
      }>;
    }
  >;
};

export type SectionBannerFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  link_text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  link_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  background_color?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  text_color?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
};

export type SectionCollectionGridFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  subheading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  columns?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  collections?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<
          StorefrontAPI.Collection,
          'id' | 'title' | 'handle' | 'description'
        > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
      >;
    }>;
  }>;
};

export type SectionCountdownFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  subheading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  end_date?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  expired_text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  button_text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  button_link?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  background_color?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  text_color?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
};

export type FaqItemFragment = Pick<StorefrontAPI.Metaobject, 'id'> & {
  question?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  answer?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
};

export type SectionFaqFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  subheading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  faqs?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          question?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          answer?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
        }
      >;
    }>;
  }>;
};

export type SectionFeaturedProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle'
> & {
  variants: {
    nodes: Array<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'altText' | 'width' | 'height' | 'url'>
      >;
    }>;
  };
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type SectionFeaturedProductsFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  label?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  show_prices?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  products?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
          variants: {
            nodes: Array<{
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'width' | 'height' | 'url'
                >
              >;
            }>;
          };
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
        }
      >;
    }>;
  }>;
};

export type FeatureItemFragment = Pick<StorefrontAPI.Metaobject, 'id'> & {
  title?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  description?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  icon?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  icon_image?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url' | 'altText'>>;
    }>;
  }>;
};

export type SectionFeaturesFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  subheading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  columns?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  features?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          title?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          description?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          icon?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          icon_image?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
            }>;
          }>;
        }
      >;
    }>;
  }>;
};

export type SectionHeroMediaImageFragment = {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'url' | 'width' | 'height'>
  >;
};

export type SectionHeroFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  subheading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  button_text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  button_link?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key'> & {
      reference?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'altText' | 'url' | 'width' | 'height'>
        >;
      }>;
    }
  >;
};

export type HeroSlideFragment = Pick<StorefrontAPI.Metaobject, 'id'> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  subheading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  button_text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  button_link?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  image?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url' | 'altText'>>;
    }>;
  }>;
};

export type SectionHeroSliderFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  autoplay?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  autoplay_speed?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  slides?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          heading?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          subheading?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          button_text?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          button_link?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          image?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
            }>;
          }>;
        }
      >;
    }>;
  }>;
};

export type SectionImageWithTextMediaImageFragment = {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'url' | 'width' | 'height'>
  >;
};

export type SectionImageWithTextFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  body?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  button_text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  button_link?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  image_position?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key'> & {
      reference?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'altText' | 'url' | 'width' | 'height'>
        >;
      }>;
    }
  >;
};

export type SectionLogosFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  grayscale?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  logos?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<{
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }>;
    }>;
  }>;
};

export type SectionNewsletterFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  placeholder?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  social_text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  twitter_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  instagram_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  facebook_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  youtube_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  pinterest_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  tiktok_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
};

export type SectionRichTextFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  content?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  link_text?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  link_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
};

export type TestimonialFragment = Pick<StorefrontAPI.Metaobject, 'id'> & {
  quote?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  author?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  role?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  rating?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  avatar?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url' | 'altText'>>;
    }>;
  }>;
};

export type SectionTestimonialsFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  testimonials?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          quote?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          author?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          role?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          rating?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
          >;
          avatar?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
            }>;
          }>;
        }
      >;
    }>;
  }>;
};

export type SectionVideoFragment = Pick<
  StorefrontAPI.Metaobject,
  'type' | 'id'
> & {
  heading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  subheading?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  video_url?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
  >;
  video_file?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      sources: Array<Pick<StorefrontAPI.VideoSource, 'url' | 'mimeType'>>;
    }>;
  }>;
  poster_image?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url' | 'altText'>>;
    }>;
  }>;
  autoplay?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  loop?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
  muted?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
  >;
};

export type SectionsFragment = {
  references?: StorefrontAPI.Maybe<{
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
        heading?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        subheading?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        button_text?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        button_link?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key'> & {
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'url' | 'width' | 'height'
                >
              >;
            }>;
          }
        >;
        autoplay?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        autoplay_speed?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        slides?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                heading?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                subheading?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                button_text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                button_link?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                image?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<{
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url' | 'altText'>
                    >;
                  }>;
                }>;
              }
            >;
          }>;
        }>;
        label?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        show_prices?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        products?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
                variants: {
                  nodes: Array<{
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'width' | 'height' | 'url'
                      >
                    >;
                  }>;
                };
                priceRange: {
                  minVariantPrice: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                };
              }
            >;
          }>;
        }>;
        columns?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        collections?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<
                StorefrontAPI.Collection,
                'id' | 'title' | 'handle' | 'description'
              > & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          }>;
        }>;
        content?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        link_text?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        link_url?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        body?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        image_position?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        video_url?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        video_file?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            sources: Array<Pick<StorefrontAPI.VideoSource, 'url' | 'mimeType'>>;
          }>;
        }>;
        poster_image?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText'>
            >;
          }>;
        }>;
        loop?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        muted?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        testimonials?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                quote?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                author?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                role?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                rating?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                avatar?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<{
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url' | 'altText'>
                    >;
                  }>;
                }>;
              }
            >;
          }>;
        }>;
        grayscale?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        logos?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<{
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
            }>;
          }>;
        }>;
        faqs?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                question?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                answer?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
              }
            >;
          }>;
        }>;
        features?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                title?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                description?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                icon?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
                icon_image?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<{
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url' | 'altText'>
                    >;
                  }>;
                }>;
              }
            >;
          }>;
        }>;
        text?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        background_color?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        text_color?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        end_date?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        expired_text?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        placeholder?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        social_text?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'>
        >;
        twitter_url?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        instagram_url?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        facebook_url?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        youtube_url?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        pinterest_url?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
        tiktok_url?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
        >;
      }
    >;
  }>;
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
        attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
        cost: {
          totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          amountPerQuantity: Pick<
            StorefrontAPI.MoneyV2,
            'currencyCode' | 'amount'
          >;
          compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
        };
        merchandise: Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'availableForSale' | 'requiresShipping' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
        };
      }
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

interface GeneratedQueryTypes {
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n  query Sitemap($urlLimits: Int, $language: LanguageCode)\n  @inContext(language: $language) {\n    products(\n      first: $urlLimits\n      query: "published_status:\'online_store:visible\'"\n    ) {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n        title\n        featuredImage {\n          url\n          altText\n        }\n      }\n    }\n    collections(\n      first: $urlLimits\n      query: "published_status:\'online_store:visible\'"\n    ) {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n      }\n    }\n    pages(first: $urlLimits, query: "published_status:\'published\'") {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n      }\n    }\n  }\n': {
    return: SitemapQuery;
    variables: SitemapQueryVariables;
  };
  '#graphql\n  fragment FeaturedCollection on Collection {\n    id\n    title\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    handle\n  }\n  query FeaturedCollection($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...FeaturedCollection\n      }\n    }\n  }\n': {
    return: FeaturedCollectionQuery;
    variables: FeaturedCollectionQueryVariables;
  };
  '#graphql\n  fragment RecommendedProduct on Product {\n    id\n    title\n    handle\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    images(first: 1) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n  }\n  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 6, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecommendedProduct\n      }\n    }\n  }\n': {
    return: RecommendedProductsQuery;
    variables: RecommendedProductsQueryVariables;
  };
  '#graphql\n  fragment OrderMoney on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment AddressFull on MailingAddress {\n    address1\n    address2\n    city\n    company\n    country\n    countryCodeV2\n    firstName\n    formatted\n    id\n    lastName\n    name\n    phone\n    province\n    provinceCode\n    zip\n  }\n  fragment DiscountApplication on DiscountApplication {\n    value {\n      __typename\n      ... on MoneyV2 {\n        ...OrderMoney\n      }\n      ... on PricingPercentageValue {\n        percentage\n      }\n    }\n  }\n  fragment OrderLineProductVariant on ProductVariant {\n    id\n    image {\n      altText\n      height\n      url\n      id\n      width\n    }\n    price {\n      ...OrderMoney\n    }\n    product {\n      handle\n    }\n    sku\n    title\n  }\n  fragment OrderLineItemFull on OrderLineItem {\n    title\n    quantity\n    discountAllocations {\n      allocatedAmount {\n        ...OrderMoney\n      }\n      discountApplication {\n        ...DiscountApplication\n      }\n    }\n    originalTotalPrice {\n      ...OrderMoney\n    }\n    discountedTotalPrice {\n      ...OrderMoney\n    }\n    variant {\n      ...OrderLineProductVariant\n    }\n  }\n  fragment Order on Order {\n    id\n    name\n    orderNumber\n    statusUrl\n    processedAt\n    fulfillmentStatus\n    totalTaxV2 {\n      ...OrderMoney\n    }\n    totalPriceV2 {\n      ...OrderMoney\n    }\n    subtotalPriceV2 {\n      ...OrderMoney\n    }\n    shippingAddress {\n      ...AddressFull\n    }\n    discountApplications(first: 100) {\n      nodes {\n        ...DiscountApplication\n      }\n    }\n    lineItems(first: 100) {\n      nodes {\n        ...OrderLineItemFull\n      }\n    }\n  }\n  query Order(\n    $country: CountryCode\n    $language: LanguageCode\n    $orderId: ID!\n  ) @inContext(country: $country, language: $language) {\n    order: node(id: $orderId) {\n      ... on Order {\n        ...Order\n      }\n    }\n  }\n': {
    return: OrderQuery;
    variables: OrderQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment Customer on Customer {\n    acceptsMarketing\n    addresses(first: 6) {\n      nodes {\n        ...Address\n      }\n    }\n    defaultAddress {\n      ...Address\n    }\n    email\n    firstName\n    lastName\n    numberOfOrders\n    phone\n  }\n  fragment Address on MailingAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    country\n    province\n    city\n    zip\n    phone\n  }\n\n  query CustomerOrders(\n    $country: CountryCode\n    $customerAccessToken: String!\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    customer(customerAccessToken: $customerAccessToken) {\n      ...CustomerOrders\n    }\n  }\n': {
    return: CustomerOrdersQuery;
    variables: CustomerOrdersQueryVariables;
  };
  '#graphql\n  query Customer(\n    $customerAccessToken: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customer(customerAccessToken: $customerAccessToken) {\n      ...Customer\n    }\n  }\n  #graphql\n  fragment Customer on Customer {\n    acceptsMarketing\n    addresses(first: 6) {\n      nodes {\n        ...Address\n      }\n    }\n    defaultAddress {\n      ...Address\n    }\n    email\n    firstName\n    lastName\n    numberOfOrders\n    phone\n  }\n  fragment Address on MailingAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    country\n    province\n    city\n    zip\n    phone\n  }\n\n': {
    return: CustomerQuery;
    variables: CustomerQueryVariables;
  };
  '#graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n  query predictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $searchTerm: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $searchTerm,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  query QuickViewProduct(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      id\n      title\n      handle\n      descriptionHtml\n      options {\n        name\n        values\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n      images(first: 5) {\n        nodes {\n          url\n          altText\n          width\n          height\n        }\n      }\n      variants(first: 50) {\n        nodes {\n          id\n          title\n          availableForSale\n          price {\n            amount\n            currencyCode\n          }\n          compareAtPrice {\n            amount\n            currencyCode\n          }\n          image {\n            url\n            altText\n            width\n            height\n          }\n          selectedOptions {\n            name\n            value\n          }\n        }\n      }\n    }\n  }\n': {
    return: QuickViewProductQuery;
    variables: QuickViewProductQueryVariables;
  };
  '#graphql\n  query Article(\n    $articleHandle: String!\n    $blogHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    blog(handle: $blogHandle) {\n      articleByHandle(handle: $articleHandle) {\n        title\n        contentHtml\n        publishedAt\n        author: authorV2 {\n          name\n        }\n        image {\n          id\n          altText\n          url\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n        }\n\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    contentHtml\n    handle\n    id\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query Blogs(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    blogs(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n      }\n    }\n  }\n': {
    return: BlogsQuery;
    variables: BlogsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        selectedOptions {\n          name\n          value\n        }\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n    $sortKey: ProductCollectionSortKeys = COLLECTION_DEFAULT\n    $reverse: Boolean = false\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        sortKey: $sortKey,\n        reverse: $reverse\n      ) {\n        nodes {\n          ...ProductItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  fragment Collection on Collection {\n    id\n    title\n    handle\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n  query StoreCollections(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...Collection\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: StoreCollectionsQuery;
    variables: StoreCollectionsQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  #graphql\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    options {\n      name\n      values\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    quantityAvailable\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductVariants on Product {\n    variants(first: 250) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    quantityAvailable\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n  query ProductVariants(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...ProductVariants\n    }\n  }\n': {
    return: ProductVariantsQuery;
    variables: ProductVariantsQueryVariables;
  };
  '#graphql\n  fragment SearchProduct on Product {\n    __typename\n    handle\n    id\n    publishedAt\n    title\n    trackingParameters\n    vendor\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n  fragment SearchPage on Page {\n     __typename\n     handle\n    id\n    title\n    trackingParameters\n  }\n  fragment SearchArticle on Article {\n    __typename\n    handle\n    id\n    title\n    trackingParameters\n  }\n  query search(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $query: String!\n    $startCursor: String\n    $sortKey: SearchSortKeys = RELEVANCE\n    $reverse: Boolean = false\n  ) @inContext(country: $country, language: $language) {\n    products: search(\n      query: $query,\n      unavailableProducts: HIDE,\n      types: [PRODUCT],\n      first: $first,\n      sortKey: $sortKey,\n      reverse: $reverse,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...on Product {\n          ...SearchProduct\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n    pages: search(\n      query: $query,\n      types: [PAGE],\n      first: 10\n    ) {\n      nodes {\n        ...on Page {\n          ...SearchPage\n        }\n      }\n    }\n    articles: search(\n      query: $query,\n      types: [ARTICLE],\n      first: 10\n    ) {\n      nodes {\n        ...on Article {\n          ...SearchArticle\n        }\n      }\n    }\n  }\n': {
    return: SearchQuery;
    variables: SearchQueryVariables;
  };
  '#graphql\n  query RouteContent($handle: String!, $country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    route: metaobject(handle: {type: "route", handle: $handle}) {\n      type\n      id\n      title: field(key: "title") {\n        key\n        value\n      }\n      sections: field(key: "sections") {\n        ...Sections\n      }\n    }\n  }\n  #graphql\n  fragment Sections on MetaobjectField {\n    references(first: 20) {\n      nodes {\n        ... on Metaobject {\n          id\n          type\n          # Hero sections\n          ...SectionHero\n          ...SectionHeroSlider\n          # Product/Collection sections\n          ...SectionFeaturedProducts\n          ...SectionCollectionGrid\n          # Content sections\n          ...SectionRichText\n          ...SectionImageWithText\n          ...SectionVideo\n          # Social proof sections\n          ...SectionTestimonials\n          ...SectionLogos\n          # Utility sections\n          ...SectionFAQ\n          ...SectionFeatures\n          ...SectionBanner\n          ...SectionCountdown\n          ...SectionNewsletter\n        }\n      }\n    }\n  }\n  #graphql\n  fragment SectionHero on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    subheading: field(key: "subheading") {\n      key\n      value\n      type\n    }\n    button_text: field(key: "button_text") {\n      key\n      value\n      type\n    }\n    button_link: field(key: "button_link") {\n      key\n      value\n      type\n    }\n    image: field(key: "image") {\n      key\n      reference {\n        ... on MediaImage {\n          ...SectionHeroMediaImage\n        }\n      }\n    }\n  }\n  #graphql\n  fragment SectionImageWithTextMediaImage on MediaImage {\n    image {\n      altText\n      url\n      width\n      height\n    }\n  }\n\n\n  #graphql\n  fragment SectionHeroSlider on Metaobject {\n    type\n    id\n    autoplay: field(key: "autoplay") {\n      key\n      value\n    }\n    autoplay_speed: field(key: "autoplay_speed") {\n      key\n      value\n    }\n    slides: field(key: "slides") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            ...HeroSlide\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment HeroSlide on Metaobject {\n    id\n    heading: field(key: "heading") {\n      key\n      value\n    }\n    subheading: field(key: "subheading") {\n      key\n      value\n    }\n    button_text: field(key: "button_text") {\n      key\n      value\n    }\n    button_link: field(key: "button_link") {\n      key\n      value\n    }\n    image: field(key: "image") {\n      reference {\n        ... on MediaImage {\n          image {\n            url\n            altText\n          }\n        }\n      }\n    }\n  }\n\n\n  #graphql\n  fragment SectionFeaturedProducts on Metaobject {\n    type\n    id\n    label: field(key: "label") {\n      key\n      value\n      type\n    }\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    show_prices: field(key: "show_prices") {\n      key\n      value\n      type\n    }\n    products: field(key: "products") {\n      references(first: 12) {\n        nodes {\n          ... on Product {\n            ...SectionFeaturedProduct\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment SectionFeaturedProduct on Product {\n    id\n    title\n    handle\n    variants(first: 1) {\n      nodes {\n        image {\n          altText\n          width\n          height\n          url\n        }\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n\n  #graphql\n  fragment SectionCollectionGrid on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    subheading: field(key: "subheading") {\n      key\n      value\n      type\n    }\n    columns: field(key: "columns") {\n      key\n      value\n    }\n    collections: field(key: "collections") {\n      references(first: 12) {\n        nodes {\n          ... on Collection {\n            id\n            title\n            handle\n            description\n            image {\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment SectionRichText on Metaobject {\n    type\n    id\n    content: field(key: "content") {\n      key\n      value\n      type\n    }\n    link_text: field(key: "link_text") {\n      key\n      value\n      type\n    }\n    link_url: field(key: "link_url") {\n      key\n      value\n      type\n    }\n  }\n\n  #graphql\n  fragment SectionImageWithText on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    body: field(key: "body") {\n      key\n      value\n      type\n    }\n    button_text: field(key: "button_text") {\n      key\n      value\n      type\n    }\n    button_link: field(key: "button_link") {\n      key\n      value\n      type\n    }\n    image_position: field(key: "image_position") {\n      key\n      value\n      type\n    }\n    image: field(key: "image") {\n      key\n      reference {\n        ... on MediaImage {\n          ...SectionImageWithTextMediaImage\n        }\n      }\n    }\n  }\n  #graphql\n  fragment SectionImageWithTextMediaImage on MediaImage {\n    image {\n      altText\n      url\n      width\n      height\n    }\n  }\n\n\n  #graphql\n  fragment SectionVideo on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    subheading: field(key: "subheading") {\n      key\n      value\n      type\n    }\n    video_url: field(key: "video_url") {\n      key\n      value\n      type\n    }\n    video_file: field(key: "video_file") {\n      reference {\n        ... on Video {\n          sources {\n            url\n            mimeType\n          }\n        }\n      }\n    }\n    poster_image: field(key: "poster_image") {\n      reference {\n        ... on MediaImage {\n          image {\n            url\n            altText\n          }\n        }\n      }\n    }\n    autoplay: field(key: "autoplay") {\n      key\n      value\n    }\n    loop: field(key: "loop") {\n      key\n      value\n    }\n    muted: field(key: "muted") {\n      key\n      value\n    }\n  }\n\n  #graphql\n  fragment SectionTestimonials on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    testimonials: field(key: "testimonials") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            ...Testimonial\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment Testimonial on Metaobject {\n    id\n    quote: field(key: "quote") {\n      key\n      value\n    }\n    author: field(key: "author") {\n      key\n      value\n    }\n    role: field(key: "role") {\n      key\n      value\n    }\n    rating: field(key: "rating") {\n      key\n      value\n    }\n    avatar: field(key: "avatar") {\n      reference {\n        ... on MediaImage {\n          image {\n            url\n            altText\n          }\n        }\n      }\n    }\n  }\n\n\n  #graphql\n  fragment SectionLogos on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    grayscale: field(key: "grayscale") {\n      key\n      value\n    }\n    logos: field(key: "logos") {\n      references(first: 20) {\n        nodes {\n          ... on MediaImage {\n            image {\n              url\n              altText\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment SectionFAQ on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    subheading: field(key: "subheading") {\n      key\n      value\n      type\n    }\n    faqs: field(key: "faqs") {\n      references(first: 20) {\n        nodes {\n          ... on Metaobject {\n            ...FAQItem\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment FAQItem on Metaobject {\n    id\n    question: field(key: "question") {\n      key\n      value\n    }\n    answer: field(key: "answer") {\n      key\n      value\n    }\n  }\n\n\n  #graphql\n  fragment SectionFeatures on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    subheading: field(key: "subheading") {\n      key\n      value\n      type\n    }\n    columns: field(key: "columns") {\n      key\n      value\n    }\n    features: field(key: "features") {\n      references(first: 12) {\n        nodes {\n          ... on Metaobject {\n            ...FeatureItem\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment FeatureItem on Metaobject {\n    id\n    title: field(key: "title") {\n      key\n      value\n    }\n    description: field(key: "description") {\n      key\n      value\n    }\n    icon: field(key: "icon") {\n      key\n      value\n    }\n    icon_image: field(key: "icon_image") {\n      reference {\n        ... on MediaImage {\n          image {\n            url\n            altText\n          }\n        }\n      }\n    }\n  }\n\n\n  #graphql\n  fragment SectionBanner on Metaobject {\n    type\n    id\n    text: field(key: "text") {\n      key\n      value\n      type\n    }\n    link_text: field(key: "link_text") {\n      key\n      value\n      type\n    }\n    link_url: field(key: "link_url") {\n      key\n      value\n      type\n    }\n    background_color: field(key: "background_color") {\n      key\n      value\n      type\n    }\n    text_color: field(key: "text_color") {\n      key\n      value\n      type\n    }\n  }\n\n  #graphql\n  fragment SectionCountdown on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    subheading: field(key: "subheading") {\n      key\n      value\n      type\n    }\n    end_date: field(key: "end_date") {\n      key\n      value\n    }\n    expired_text: field(key: "expired_text") {\n      key\n      value\n      type\n    }\n    button_text: field(key: "button_text") {\n      key\n      value\n      type\n    }\n    button_link: field(key: "button_link") {\n      key\n      value\n      type\n    }\n    background_color: field(key: "background_color") {\n      key\n      value\n      type\n    }\n    text_color: field(key: "text_color") {\n      key\n      value\n      type\n    }\n  }\n\n  #graphql\n  fragment SectionNewsletter on Metaobject {\n    type\n    id\n    heading: field(key: "heading") {\n      key\n      value\n      type\n    }\n    placeholder: field(key: "placeholder") {\n      key\n      value\n      type\n    }\n    social_text: field(key: "social_text") {\n      key\n      value\n      type\n    }\n    twitter_url: field(key: "twitter_url") {\n      key\n      value\n    }\n    instagram_url: field(key: "instagram_url") {\n      key\n      value\n    }\n    facebook_url: field(key: "facebook_url") {\n      key\n      value\n    }\n    youtube_url: field(key: "youtube_url") {\n      key\n      value\n    }\n    pinterest_url: field(key: "pinterest_url") {\n      key\n      value\n    }\n    tiktok_url: field(key: "tiktok_url") {\n      key\n      value\n    }\n  }\n\n\n': {
    return: RouteContentQuery;
    variables: RouteContentQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation customerAddressUpdate(\n    $address: MailingAddressInput!\n    $customerAccessToken: String!\n    $id: ID!\n    $country: CountryCode\n    $language: LanguageCode\n ) @inContext(country: $country, language: $language) {\n    customerAddressUpdate(\n      address: $address\n      customerAccessToken: $customerAccessToken\n      id: $id\n    ) {\n      customerAddress {\n        id\n      }\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressUpdateMutation;
    variables: CustomerAddressUpdateMutationVariables;
  };
  '#graphql\n  mutation customerAddressDelete(\n    $customerAccessToken: String!,\n    $id: ID!,\n    $country: CountryCode,\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {\n      customerUserErrors {\n        code\n        field\n        message\n      }\n      deletedCustomerAddressId\n    }\n  }\n': {
    return: CustomerAddressDeleteMutation;
    variables: CustomerAddressDeleteMutationVariables;
  };
  '#graphql\n  mutation customerDefaultAddressUpdate(\n    $addressId: ID!\n    $customerAccessToken: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customerDefaultAddressUpdate(\n      addressId: $addressId\n      customerAccessToken: $customerAccessToken\n    ) {\n      customer {\n        defaultAddress {\n          id\n        }\n      }\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerDefaultAddressUpdateMutation;
    variables: CustomerDefaultAddressUpdateMutationVariables;
  };
  '#graphql\n  mutation customerAddressCreate(\n    $address: MailingAddressInput!\n    $customerAccessToken: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customerAddressCreate(\n      address: $address\n      customerAccessToken: $customerAccessToken\n    ) {\n      customerAddress {\n        id\n      }\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressCreateMutation;
    variables: CustomerAddressCreateMutationVariables;
  };
  '#graphql\n  # https://shopify.dev/docs/api/storefront/latest/mutations/customerUpdate\n  mutation customerUpdate(\n    $customerAccessToken: String!,\n    $customer: CustomerUpdateInput!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {\n      customer {\n        acceptsMarketing\n        email\n        firstName\n        id\n        lastName\n        phone\n      }\n      customerAccessToken {\n        accessToken\n        expiresAt\n      }\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerUpdateMutation;
    variables: CustomerUpdateMutationVariables;
  };
  '#graphql\n  mutation customerActivate(\n    $id: ID!,\n    $input: CustomerActivateInput!,\n    $country: CountryCode,\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customerActivate(id: $id, input: $input) {\n      customerAccessToken {\n        accessToken\n        expiresAt\n      }\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerActivateMutation;
    variables: CustomerActivateMutationVariables;
  };
  '#graphql\n  mutation login($input: CustomerAccessTokenCreateInput!) {\n    customerAccessTokenCreate(input: $input) {\n      customerUserErrors {\n        code\n        field\n        message\n      }\n      customerAccessToken {\n        accessToken\n        expiresAt\n      }\n    }\n  }\n': {
    return: LoginMutation;
    variables: LoginMutationVariables;
  };
  '#graphql\n  mutation customerRecover(\n    $email: String!,\n    $country: CountryCode,\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customerRecover(email: $email) {\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerRecoverMutation;
    variables: CustomerRecoverMutationVariables;
  };
  '#graphql\n  mutation customerCreate(\n    $input: CustomerCreateInput!,\n    $country: CountryCode,\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customerCreate(input: $input) {\n      customer {\n        id\n      }\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerCreateMutation;
    variables: CustomerCreateMutationVariables;
  };
  '#graphql\n  mutation registerLogin(\n    $input: CustomerAccessTokenCreateInput!,\n    $country: CountryCode,\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customerAccessTokenCreate(input: $input) {\n      customerUserErrors {\n        code\n        field\n        message\n      }\n      customerAccessToken {\n        accessToken\n        expiresAt\n      }\n    }\n  }\n': {
    return: RegisterLoginMutation;
    variables: RegisterLoginMutationVariables;
  };
  '#graphql\n  mutation customerReset(\n    $id: ID!,\n    $input: CustomerResetInput!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    customerReset(id: $id, input: $input) {\n      customerAccessToken {\n        accessToken\n        expiresAt\n      }\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerResetMutation;
    variables: CustomerResetMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
