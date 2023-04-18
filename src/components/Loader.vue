<template>
    <div class="cp-loader">
        <div class="loader-outer"></div>
        <div class="loader-inner"></div>
    </div>
</template>


<style lang="scss">
.cp-loader {
    border-radius: 50%;
    display: block;
    margin: 75px auto;
    position: relative;
    height: 60px;
    vertical-align: middle;
    width: 60px;

    .loader-outer {
        animation: loader-outer 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
        border: 4px solid #f50057;
        border-left-color: transparent;
        border-bottom: 0;
        border-radius: 50%;
        height: 100%;
        position: absolute;
        width: 100%;
    }

    .loader-inner {
        animation: loader-inner 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
        border: 4px solid #f50057;
        border-radius: 50%;
        border-right: 0;
        border-top-color: transparent;
        height: 40px;
        left: calc(50% - 20px);
        position: absolute;
        top: calc(50% - 20px);
        width: 40px;
    }
}
@keyframes loader-outer {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes loader-inner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(-360deg);
    }
}
</style>
