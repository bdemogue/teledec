export type Country = {
    name: string,
    code: string,
}

export type Address = {
    street: string;
    zip_code: string;
    city: string;
    country: Country
};

export type TaxRevenue = {
    rents: number|null;
    subsidies: number|null;
    total: number;
};
export type Costs = {
    expense: number|null;
    tax: number|null;
    insurance_premiums: number|null;
    total: number;
};

export type RealEstate = {
    id: number|null;
    name: string;
    address: Address;
    tax_revenue: TaxRevenue;
    costs: Costs;
    net_income: number;
};

