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

-- ============================================================
-- Crosshair Config
-- ============================================================

local crosshairEnabled = true
local crosshairDisplayMode = "always"

--- Applies crosshair color via FiveM console variables (cl_crosshaircolor_r/g/b/a).
--- SetCrosshairColour does not exist in FiveM — cvars are the correct approach.
local function applyCrosshairColor(r, g, b, a)
    ExecuteCommand("cl_crosshaircolor 5")
    ExecuteCommand("cl_crosshaircolor_r " .. tostring(r))
    ExecuteCommand("cl_crosshaircolor_g " .. tostring(g))
    ExecuteCommand("cl_crosshaircolor_b " .. tostring(b))
    ExecuteCommand("cl_crosshairusealpha true")
    ExecuteCommand("cl_crosshairalpha " .. tostring(a))
end

--- Reads all crosshair KVPs with safe fallbacks and sends the
--- config to the NUI. Also applies the saved colour via cvars.
local function loadCrosshairConfig()
    -- Colour — stored as JSON to preserve all four RGBA channels
    local colorJson = GetResourceKvpString("mri_Qfps:CrosshairColor")
    local color
    if colorJson then
        local ok, decoded = pcall(json.decode, colorJson)
        color = (ok and decoded) or { r = 255, g = 255, b = 255, a = 255 }
    else
        color = { r = 255, g = 255, b = 255, a = 255 }
    end

    local size    = tonumber(GetResourceKvpString("mri_Qfps:CrosshairSize")) or 10
    local style   = GetResourceKvpString("mri_Qfps:CrosshairStyle") or "dot"
    local enabledStr = GetResourceKvpString("mri_Qfps:CrosshairEnabled")
    crosshairEnabled = (enabledStr == nil) and true or (enabledStr == "true")
    crosshairDisplayMode = GetResourceKvpString("mri_Qfps:CrosshairDisplayMode") or "always"

    -- Clamp size to valid range
    size = math.max(4, math.min(32, size))

    -- Apply colour via cvars
    applyCrosshairColor(color.r, color.g, color.b, color.a)

    local config = {
        color       = color,
        size        = size,
        style       = style,
        enabled     = crosshairEnabled,
        displayMode = crosshairDisplayMode,
    }

    -- Send config to NUI so the overlay and form reflect saved values
    SendNUIMessage({
        action = "loadCrosshairConfig",
        data   = config,
    })
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
    loadCrosshairConfig()
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

RegisterNUICallback("setCrosshairColor", function(data, cb)
    local r = tonumber(data.r) or 255
    local g = tonumber(data.g) or 255
    local b = tonumber(data.b) or 255
    local a = tonumber(data.a) or 255

    -- Apply via cvars
    applyCrosshairColor(r, g, b, a)

    -- Persist as JSON
    SetResourceKvp("mri_Qfps:CrosshairColor", json.encode({ r = r, g = g, b = b, a = a }))

    cb("ok")
end)

RegisterNUICallback("setCrosshairConfig", function(data, cb)
    local size  = math.max(4, math.min(32, tonumber(data.size) or 10))
    local style = tostring(data.style or "dot")
    local displayMode = tostring(data.displayMode or "always")

    crosshairDisplayMode = displayMode

    SetResourceKvp("mri_Qfps:CrosshairSize",  tostring(size))
    SetResourceKvp("mri_Qfps:CrosshairStyle", style)
    SetResourceKvp("mri_Qfps:CrosshairDisplayMode", displayMode)

    cb("ok")
end)

RegisterNUICallback("setCrosshairEnabled", function(data, cb)
    local enabled = data.enabled == true or data.enabled == "true"
    crosshairEnabled = enabled

    SetResourceKvp("mri_Qfps:CrosshairEnabled", tostring(enabled))

    -- Notify the NUI so the overlay visibility updates immediately
    SendNUIMessage({
        action = "setCrosshairEnabled",
        data   = { enabled = enabled },
    })

    cb("ok")
end)

-- Thread to manage custom crosshair visibility and default reticle hiding
CreateThread(function()
    local isAiming = false
    while true do
        local ped = PlayerPedId()
        if crosshairEnabled then
            -- Hide native GTA V crosshair/reticle (HUD Component 14)
            HideHudComponentThisFrame(14)

            -- If displayMode is aiming, check if the ped is aiming and notify NUI
            if crosshairDisplayMode == "aiming" then
                -- Check if player is aiming (either aiming with weapon, or free-aiming)
                local aimingState = IsPlayerFreeAiming(PlayerId()) or IsAimCamActive() or IsPedAimingFromCover(ped)
                if aimingState ~= isAiming then
                    isAiming = aimingState
                    SendNUIMessage({
                        action = "setAiming",
                        data   = { aiming = isAiming }
                    })
                end
            else
                -- If not in aiming mode, reset state
                if isAiming then
                    isAiming = false
                    SendNUIMessage({
                        action = "setAiming",
                        data   = { aiming = false }
                    })
                end
            end
        else
            -- If custom crosshair is disabled, reset aiming state
            if isAiming then
                isAiming = false
                SendNUIMessage({
                    action = "setAiming",
                    data   = { aiming = false }
                })
            end
        end
        Wait(0)
    end
end)
