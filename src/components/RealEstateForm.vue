<script lang="ts" setup>
import { ref, reactive, PropType, watchEffect } from 'vue';
import { Country, Address, Costs, RealEstate, TaxRevenue } from '@/types';
import Loader from '@/components/Loader.vue';
import { useRealEstateStore} from '@/store/real-estate';


const props = defineProps({
    selected: {
        type: Object as PropType<RealEstate>,
        required: false,
    },
});
const store = useRealEstateStore();
const emit = defineEmits(['onClose']);
const isLoaded = ref(false);
const $form = ref();
const countries = ref([] as Country[]);
const realEstate: RealEstate = reactive(props.selected || {
    id: null,
    name: '',
    address: {
        street: '',
        zip_code: '',
        city: '',
        country: {
            name: '',
            code: '',
        } as Country,
    } as Address,
    tax_revenue: {
        rents: null,
        subsidies: null,
        total: 0,
    } as TaxRevenue,
    costs: {
        expense: null,
        tax: null,
        insurance_premiums: null,
        total: 0,
    } as Costs,
    net_income: 0
});

const requiredField = (value: any) => {
    return !!value || 'Ce champ est requis';
};

const getCountries = async () => {
    isLoaded.value = true;
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/countries`);
        const data = await response.json();
        countries.value = data;
    } catch (error) {
        console.log(error);
    }
    isLoaded.value = false;
}

getCountries();

watchEffect(() => {
    if( Object.keys(realEstate).length === 0) return;
    realEstate.tax_revenue.total = (realEstate.tax_revenue.rents ?? 0) + (realEstate.tax_revenue.subsidies ?? 0);
});

watchEffect(() => {
    if( Object.keys(realEstate).length === 0) return;
    realEstate.costs.total = (realEstate.costs.expense ?? 0) + (realEstate.costs.tax ?? 0) + (realEstate.costs.insurance_premiums ?? 0);
});

watchEffect(() => {
    if( Object.keys(realEstate).length === 0) return;
    realEstate.net_income = realEstate.tax_revenue.total - realEstate.costs.total;
});


const submit = async () => {
    const { valid } = await $form.value.validate();
    if (!valid) {
        return
    }

    isLoaded.value = true;

    try {
        const method = props.selected?.id ? 'updateItem' : 'createItem';
        await store[method](realEstate);

        emit('onClose');
    } catch (error) {
        console.log(error);
    }
    isLoaded.value = false;
}

const closeDialog = () => {
    emit('onClose');
}

</script>
<template>
    <v-card class="bg-primary-darken-1" justify="center">
        <loader v-if="isLoaded" />
        <v-container v-else>
            <v-row justify="center">
                <v-col
                    sm="12"
                    md="6"
                >
                    <v-card-title justify="center">
                        <div v-if="props.selected" class="text-h5 text-center">Modification du bien</div>
                        <div v-else class="text-h5 text-center">Ajouter un bien</div>
                    </v-card-title>
                    <v-form ref="$form" class="cp-real-estate-form" @submit.prevent="submit">
                        <v-card-text>
                                <v-row>
                                    <v-col
                                        sm="12"
                                    >
                                        <v-text-field
                                            v-model="realEstate.name"
                                            :rules="[requiredField]"
                                            required
                                            label="Name"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <fieldset>
                                    <legend class="text-subtitle-1 font-weight-bold mb-2">Adresse</legend>
                                    <v-row>
                                        <v-col
                                            class="pb-0"
                                            cols="12"
                                        >
                                            <v-text-field
                                                v-model="realEstate.address.street"
                                                label="Numéro, rue et voie"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="realEstate.address.zip_code"
                                                label="Code postal"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="realEstate.address.city"
                                                label="Ville"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-select
                                                v-model="realEstate.address.country"
                                                :items="countries"
                                                item-title="name"
                                                item-value="code"
                                                return-object
                                                single-line
                                                label="Pays"
                                            ></v-select>
                                        </v-col>
                                    </v-row>

                                </fieldset>
                                <fieldset>
                                    <legend class="text-subtitle-1 font-weight-bold mb-1">Recettes</legend>
                                    <v-text-field
                                        v-model.number="realEstate.tax_revenue.rents"
                                        :rules="[requiredField]"
                                        required
                                        type="number"
                                        label="Loyers encaissés"
                                    ></v-text-field>

                                    <v-text-field
                                        v-model.number="realEstate.tax_revenue.subsidies"
                                        type="number"
                                        label="Subventions pour travaux spéciaux"
                                    ></v-text-field>

                                    <v-text-field
                                        readonly
                                        variant="solo"
                                        v-model.number="realEstate.tax_revenue.total"
                                        type="number"
                                        label="Total des recettes"
                                    ></v-text-field>
                                </fieldset>
                                <fieldset>
                                    <legend class="text-subtitle-1 font-weight-bold mb-1">Charges</legend>

                                    <v-text-field
                                        v-model.number="realEstate.costs.expense"
                                        type="number"
                                        label="Dépenses de travaux"
                                    ></v-text-field>

                                    <v-text-field
                                        v-model.number="realEstate.costs.tax"
                                        type="number"
                                        label="Imposition"
                                    ></v-text-field>

                                    <v-text-field
                                        v-model.number="realEstate.costs.insurance_premiums"
                                        type="number"
                                        label="Primes d'assurance"
                                    ></v-text-field>

                                    <v-text-field
                                        readonly
                                        variant="solo"
                                        v-model.number="realEstate.costs.total"
                                        type="number"
                                        label="Total des charges"
                                    ></v-text-field>
                                </fieldset>
                                <v-row class="mt-2">
                                    <v-col
                                        sm="12"
                                    >
                                        <v-text-field
                                            readonly
                                            variant="solo"
                                            v-model="realEstate.net_income"
                                            label="Revenu net"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                        </v-card-text>
                        <v-card-actions class="v-container">
                            <v-spacer></v-spacer>
                            <v-btn
                                color="secondary"
                                variant="text"
                                @click="closeDialog"
                            >
                                Annuler
                            </v-btn>
                            <v-btn
                                color="blue-darken-1"
                                variant="text"
                                type="submit"
                            >
                                Sauvegarder
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<style lang="scss" >
.cp-real-estate-form {
    fieldset {
        border: 0;
        margin-top: 1rem;
    }
}

</style>

