import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { setActivePinia, createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mount } from '@vue/test-utils';
import RealEstateList  from '../RealEstateList.vue';

const vuetify = createVuetify({ components, directives });

function createFetchResponse(data: any) {
    return { json: () => new Promise((resolve) => resolve(data)) }
}

describe('RealEstateList', () => {
    beforeEach(() => {
        global.fetch = vi.fn()
        vi.useFakeTimers();
        setActivePinia(createPinia())
    })
    afterEach(() => {
        vi.useRealTimers();
    })
    test('render a list of real estates', async() => {

        const realEstates = [
            {
                "id": 1,
                "name": "Appartement bruxelles est",
                "address": {
                    "street": "2 rue de l'Abbaye",
                    "zip_code": "1010",
                    "city": "Bruxelles",
                    "country": {
                        "name": "Belgique",
                        "code": "BE"
                    }
                },
                "tax_revenue": {
                    "rents": 9862,
                    "subsidies": 256,
                    "total": 10118
                },
                "costs": {
                    "expense": 450,
                    "tax": 1000,
                    "insurance_premiums": 250,
                    "total": 1700
                },
                "net_income": 8418
            },
            {
                "id": 2,
                "name": "Appartement bruxelles ouest",
                "address": {
                    "street": "2 rue de l'Abbaye",
                    "zip_code": "1010",
                    "city": "Bruxelles",
                    "country": {
                        "name": "Belgique",
                        "code": "BE"
                    }
                },
                "tax_revenue": {
                    "rents": 9862,
                    "subsidies": 256,

                    "total": 10118
                },
                "costs": {
                    "expense": 450,
                    "tax": 1000,
                    "insurance_premiums": 250,
                    "total": 1700
                },
                "net_income": 8418
            },
        ];

        fetch.mockResolvedValueOnce(createFetchResponse(realEstates))

        const wrapper = mount(RealEstateList, { global: {plugins: [vuetify]} });

        await vi.runAllTimersAsync()

        expect(wrapper.find('[data-testid="real-estate-list"]').exists()).toBe(true);
        expect(wrapper.findAllComponents({name: 'VCard'}).length).toBe(2);
    })
    test('delete a real estate', async() => {

        const realEstates = [
            {
                "id": 1,
                "name": "Appartement bruxelles est",
                "address": {
                    "street": "2 rue de l'Abbaye",
                    "zip_code": "1010",
                    "city": "Bruxelles",
                    "country": {
                        "name": "Belgique",
                        "code": "BE"
                    }
                },
                "tax_revenue": {
                    "rents": 9862,
                    "subsidies": 256,
                    "total": 10118
                },
                "costs": {
                    "expense": 450,
                    "tax": 1000,
                    "insurance_premiums": 250,
                    "total": 1700
                },
                "net_income": 8418
            },
            {
                "id": 2,
                "name": "Appartement bruxelles ouest",
                "address": {
                    "street": "2 rue de l'Abbaye",
                    "zip_code": "1010",
                    "city": "Bruxelles",
                    "country": {
                        "name": "Belgique",
                        "code": "BE"
                    }
                },
                "tax_revenue": {
                    "rents": 9862,
                    "subsidies": 256,

                    "total": 10118
                },
                "costs": {
                    "expense": 450,
                    "tax": 1000,
                    "insurance_premiums": 250,
                    "total": 1700
                },
                "net_income": 8418
            },
        ];

        fetch.mockResolvedValue(createFetchResponse(realEstates))

        const wrapper = mount(RealEstateList, { global: {plugins: [vuetify]} });

        await vi.runAllTimersAsync();

        const deleteButton = wrapper.find('[data-testid="open-confirm-delete-real-estate"]');
        await deleteButton.trigger('click');

        await document.querySelector('[data-testid="delete-real-estate"]')?.click();
        expect(wrapper.findAllComponents({name: 'VCard'}).length).toBe(1);
    })
})
