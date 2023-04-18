<script lang="ts" setup>
import { ref, computed } from 'vue';
import RealEstateForm from '@/components/RealEstateForm.vue';
import { RealEstate } from '@/types';
import Loader from '@/components/Loader.vue';
import DeleteRealEstateConfirm from '@/components/DeleteRealEstateConfirm.vue';
import { useRealEstateStore} from '@/store/real-estate';
import { storeToRefs } from 'pinia';

const store = useRealEstateStore();
const { list, loading } = storeToRefs(store);
const { fetchList } = store;
const dialogRealEstateForm = ref(false);
const dialogDeleteRealEstate = ref(false);
const selectedRealEstate = ref(null as RealEstate | null);
const selectedId = ref(null as number | null);

fetchList();

const totalNetIncome = computed(() => {
    if(list.value.length === 0) return 0;

    return list.value.reduce((acc, item) => acc + item.net_income, 0);
});

const openRealEstateForm = (realEstate: RealEstate) => {
    selectedRealEstate.value = realEstate;
    dialogRealEstateForm.value = true;
}

const closeDialog = () => {
    selectedRealEstate.value = null;
    selectedId.value = null;
    dialogRealEstateForm.value = false;
    dialogDeleteRealEstate.value = false;
}

const openDeleteRealEstate = (idRealEstate: number) => {
    selectedId.value = idRealEstate;
    dialogDeleteRealEstate.value = true;
}

const createJson = computed(() => {
    return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list.value));
});

</script>
<template>
    <v-container class="">
        <h1 class="my-2">Liste des biens</h1>
        <loader v-if="loading" />
        <template v-else>
            <div v-if="list.length"
                 data-testid="real-estate-list"
                 class="cp-real-estate-list d-flex flex-row justify-start mb-6">
                <v-card
                    v-for="item in list"
                    :key="item.id"
                    class="d-flex flex-column gap-1"
                >
                    <v-card-text>
                        <h2 class="mb-2">{{ item.name }}</h2>
                        <div class="text--primary">
                            {{ item.address.street }}<br />
                            {{ `${item.address.zip_code} ${item.address.city}, ${item.address.country.name}` }}
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-md-space-between">
                        <v-btn
                            class="text-error"
                            variant="text"
                            @click="openDeleteRealEstate(item.id)"
                            data-testid="open-confirm-delete-real-estate"
                        >
                            <v-icon>mdi-delete</v-icon>
                            Supprimer
                        </v-btn>
                        <v-btn
                            color="primary"
                            rounded="xs"
                            variant="text"
                            @click="openRealEstateForm(item)"
                        >
                            Modifier
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
            <p v-else>Vous n'avez pas de bien enregistré.<br/>
                <span class="text-primary cursor-pointer" @click="dialogRealEstateForm = true">Ajoutez</span> dès maintenant des biens.</p>
        </template>
        <div class="cp-bottom-bar bg-secondary-darken-1">
            <v-container class="d-flex align-center justify-space-between">
                <div >
                    <v-btn
                        variant="tonal"
                        class="text-tertiary mr-1"
                        prepend-icon="mdi-plus"
                        density="compact"
                        @click="dialogRealEstateForm = true"
                    >
                        Ajouter un bien
                    </v-btn>
                    <v-btn
                        v-if="list.length"
                        :href="createJson"
                        target="_blank"
                        variant="tonal"
                        class="text-tertiary"
                        prepend-icon="mdi-file-export"
                        density="compact"
                        download="list.json"
                    >
                        Exporter la liste
                    </v-btn>
                </div>
                <div v-if="list.length" class="font-weight-bold text-uppercase text-body-1">
                  Revenu net :
                    {{ totalNetIncome }} €
                </div>
            </v-container>
        </div>

        <v-dialog
            v-model="dialogRealEstateForm"
            scrollable
            fullscreen
            :scrim="false"
            transition="dialog-bottom-transition"
        >

            <real-estate-form :selected="selectedRealEstate"
                              @onClose="closeDialog" />
        </v-dialog>

        <v-dialog
            v-model="dialogDeleteRealEstate"
            width="auto">
            <delete-real-estate-confirm v-if="selectedId"
                                        :real-estate-id="selectedId"
                                        @onClose="closeDialog"
                                         />
        </v-dialog>
  </v-container>
</template>
<style lang="scss">
.cp-real-estate-list {
    flex-wrap: wrap;
    gap: 1rem;

    .v-card {
        width: 100%;

        @media (min-width: 600px) {
            width: calc(50% - 1rem);
        }
        @media (min-width: 1200px) {
            width: calc(25% - 1rem);
        }
    }
}

.cp-bottom-bar {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
}

.cp-alert-dialog {
    left: 50%;
    max-width: 35rem;
    position: fixed;
    top: 50px;
    transform: translateX(-50%);
    width: 90%;
    z-index: 1005;
}

.cursor-pointer {
    cursor: pointer;
}
</style>


