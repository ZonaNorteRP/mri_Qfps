ColorScheme = GlobalState.UIColors or {}
local timecycleModifier = "default"
local lodDistance = nil
local lightsCutOff = 1.0
local shadowsCutOff = 1.0
local presetFps = "default"

local function ifThen(condition, ifTrue, ifFalse)
    if condition then
        return ifTrue
    end
    return ifFalse
end

local function setPlayerTimecycleModifier(args)
    if args.cycle == "default" then
        ClearTimecycleModifier()
        ClearExtraTimecycleModifier()
    else
        SetTimecycleModifier(args.cycle)
        if args.extra then
            SetExtraTimecycleModifier(args.extra)
        end
    end
    SetResourceKvp("mri_Qfps:TimecycleModifier", args.cycle)
    timecycleModifier = args.cycle
    if args and args.callback then
        args.callback()
    end
end

local function Optimize(status)
	local ped = PlayerPedId()
	if (status) then
		ClearBrief()
		ClearFocus()
		ClearPrints()
		ClearHdArea()
		ClearGpsFlags()
		SetRainLevel(0.0)
		SetWindSpeed(0.0)
		ClearSmallPrints()
		ClearReplayStats()
		ClearPedWetness(ped)
		ClearPedEnvDirt(ped)
		ClearAllBrokenGlass()
		ClearOverrideWeather()
		ClearAllHelpMessages()
		DisableScreenblurFade()
		ClearPedBloodDamage(ped)
		ResetPedVisibleDamage(ped)
		LeaderboardsReadClearAll()
		LeaderboardsClearCacheData()
		DisplayRadar(false)
		RopeDrawShadowEnabled(false)
		CascadeShadowsClearShadowSampleType()
		CascadeShadowsSetAircraftMode(false)
		CascadeShadowsEnableEntityTracker(true)
		CascadeShadowsSetDynamicDepthMode(false)
		CascadeShadowsInitSession()
		CascadeShadowsSetEntityTrackerScale(0.0)
		CascadeShadowsSetDynamicDepthValue(0.0)
		CascadeShadowsSetCascadeBoundsScale(0.0)
		SetFlashLightFadeDistance(0.0)
		SetLightsCutoffDistanceTweak(0.0)
		DistantCopCarSirens(false)
		SetPedAoBlobRendering(ped, false)
	else
		RopeDrawShadowEnabled(true)
		CascadeShadowsClearShadowSampleType()
		CascadeShadowsSetAircraftMode(true)
		CascadeShadowsEnableEntityTracker(false)
		CascadeShadowsSetDynamicDepthMode(true)
		CascadeShadowsInitSession()
		CascadeShadowsSetEntityTrackerScale(0.0)
		CascadeShadowsSetDynamicDepthValue(0.0)
		CascadeShadowsSetCascadeBoundsScale(0.0)
		SetFlashLightFadeDistance(0.0)
		SetLightsCutoffDistanceTweak(0.0)
		DistantCopCarSirens(false)
		SetPedAoBlobRendering(ped, true)
        DisplayRadar(true)
	end
end

local function setPresetFps(preset)
    if preset then
        presetFps = preset
        SetResourceKvp("mri_Qfps:PresetFps", presetFps)

        if preset == "ulow" then
            Optimize(true)
            TriggerEvent("Notify", "sucesso", "Sistema de Limpeza e Otimização ativado.", 5000)
        else
            Optimize(false)
        end
    end
end

local function mriFpsMenu()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'setVisible',
        data = true
    })
end

local function startFpsBoost()
    CreateThread(function()
        local lastLightVal = nil
        local lastPresetFps = nil
        local lastShadowsCutOff = nil

        if lightsCutOff ~= nil then
            DisableVehicleDistantlights(lightsCutOff <= 1.0)
        end
        while true do
            if lodDistance ~= nil then
                OverrideLodscaleThisFrame(lodDistance)
            end

            if presetFps ~= lastPresetFps or lightsCutOff ~= lastLightVal or shadowsCutOff ~= lastShadowsCutOff then
                lastPresetFps = presetFps
                lastLightVal = lightsCutOff
                lastShadowsCutOff = shadowsCutOff

                if presetFps == "default" then

                    if lightsCutOff ~= nil then
                        SetLightsCutoffDistanceTweak(lightsCutOff)
                        SetFlashLightFadeDistance(lightsCutOff)
                        DisableVehicleDistantlights(lightsCutOff <= 1.0)
                    else
                        SetFlashLightFadeDistance(10.0)
                        SetLightsCutoffDistanceTweak(10.0)
                    end

                    if shadowsCutOff ~= nil then
                        if shadowsCutOff > 0 then
                            RopeDrawShadowEnabled(true)
                            CascadeShadowsClearShadowSampleType()
                            CascadeShadowsSetAircraftMode(true)
                            CascadeShadowsEnableEntityTracker(true)
                            CascadeShadowsSetDynamicDepthMode(true)
                            CascadeShadowsInitSession()
                            SetPedAoBlobRendering(cache.ped, true)
                            CascadeShadowsSetEntityTrackerScale(shadowsCutOff)
                            CascadeShadowsSetDynamicDepthValue(shadowsCutOff)
                            CascadeShadowsSetCascadeBoundsScale(shadowsCutOff)
                        else
                            RopeDrawShadowEnabled(false)
                            CascadeShadowsSetAircraftMode(false)
                            CascadeShadowsEnableEntityTracker(false)
                            CascadeShadowsSetDynamicDepthMode(false)
                            SetPedAoBlobRendering(cache.ped, false)
                            CascadeShadowsSetEntityTrackerScale(shadowsCutOff)
                            CascadeShadowsSetDynamicDepthValue(shadowsCutOff)
                            CascadeShadowsSetCascadeBoundsScale(shadowsCutOff)
                        end
                    else
                        RopeDrawShadowEnabled(true)

                        CascadeShadowsSetAircraftMode(true)
                        CascadeShadowsEnableEntityTracker(false)
                        CascadeShadowsSetDynamicDepthMode(true)
                        CascadeShadowsSetEntityTrackerScale(5.0)
                        CascadeShadowsSetDynamicDepthValue(5.0)
                        CascadeShadowsSetCascadeBoundsScale(5.0)
                    end
                elseif presetFps == "ulow" then
                    RopeDrawShadowEnabled(false)

                    CascadeShadowsClearShadowSampleType()
                    CascadeShadowsSetAircraftMode(false)
                    CascadeShadowsEnableEntityTracker(true)
                    CascadeShadowsSetDynamicDepthMode(false)
                    CascadeShadowsSetEntityTrackerScale(0.0)
                    CascadeShadowsSetDynamicDepthValue(0.0)
                    CascadeShadowsSetCascadeBoundsScale(0.0)

                    SetFlashLightFadeDistance(0.0)
                    SetLightsCutoffDistanceTweak(0.0)
                elseif presetFps == "low" then
                    RopeDrawShadowEnabled(false)

                    CascadeShadowsClearShadowSampleType()
                    CascadeShadowsSetAircraftMode(false)
                    CascadeShadowsEnableEntityTracker(true)
                    CascadeShadowsSetDynamicDepthMode(false)
                    CascadeShadowsSetEntityTrackerScale(0.0)
                    CascadeShadowsSetDynamicDepthValue(0.0)
                    CascadeShadowsSetCascadeBoundsScale(0.0)

                    SetFlashLightFadeDistance(5.0)
                    SetLightsCutoffDistanceTweak(5.0)
                elseif presetFps == "medium" then
                    RopeDrawShadowEnabled(true)

                    CascadeShadowsClearShadowSampleType()
                    CascadeShadowsSetAircraftMode(false)
                    CascadeShadowsEnableEntityTracker(true)
                    CascadeShadowsSetDynamicDepthMode(false)
                    CascadeShadowsSetEntityTrackerScale(5.0)
                    CascadeShadowsSetDynamicDepthValue(3.0)
                    CascadeShadowsSetCascadeBoundsScale(3.0)

                    SetFlashLightFadeDistance(3.0)
                    SetLightsCutoffDistanceTweak(3.0)
                end
            end

            if lodDistance ~= nil then
                Wait(0)
            else
                Wait(500)
            end
        end
    end)
end

local function init()
    timecycleModifier = GetResourceKvpString("mri_Qfps:TimecycleModifier") or "default"
    if Config.LoadingDistanceEnabled then
        lodDistance = tonumber(GetResourceKvpString("mri_Qfps:LodDistance")) or nil
    end
    lightsCutOff = tonumber(GetResourceKvpString("mri_Qfps:LightsCutoff")) or nil
    shadowsCutOff = tonumber(GetResourceKvpString("mri_Qfps:ShadowsCutoff")) or 1.0
    presetFps = GetResourceKvpString("mri_Qfps:PresetFps") or "default"
    setPlayerTimecycleModifier({cycle = timecycleModifier})
    
    if presetFps == "ulow" then
        Optimize(true)
    end

    startFpsBoost()
end

AddEventHandler("QBCore:Client:OnPlayerLoaded", function()
    init()
end)

AddEventHandler("onResourceStart", function(resource)
    if resource == GetCurrentResourceName() then
        init()
    end
end)

RegisterNetEvent("mri_Qfps:openFpsMenu", function()
    mriFpsMenu()
end)

RegisterNUICallback("close", function(data, cb)
    SetNuiFocus(false, false)
    cb("ok")
end)

RegisterNUICallback("setPresetFps", function(data, cb)
    setPresetFps(data.preset)
    cb("ok")
end)

RegisterNUICallback("setSliders", function(data, cb)
    if data.lodDistance ~= nil then
        lodDistance = tonumber(data.lodDistance)
        SetResourceKvp("mri_Qfps:LodDistance", lodDistance)
    end
    if data.lightsCutoff ~= nil then
        lightsCutOff = tonumber(data.lightsCutoff)
        SetResourceKvp("mri_Qfps:LightsCutOff", lightsCutOff)
    end
    if data.shadowsCutoff ~= nil then
        shadowsCutOff = tonumber(data.shadowsCutoff)
        SetResourceKvp("mri_Qfps:ShadowsCutOff", shadowsCutOff)
    end
    cb("ok")
end)