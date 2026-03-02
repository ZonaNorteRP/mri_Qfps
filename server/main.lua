lib.addCommand('fps', {
    help = 'Exibir menu fps MRI',
}, function(source, args)
    return TriggerClientEvent("mri_Qfps:openFpsMenu", source)
end)
